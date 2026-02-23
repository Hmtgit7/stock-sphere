import { Injectable, Logger } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import axios from 'axios';

interface YahooChartMeta {
  regularMarketPrice?: number;
  previousClose?: number;
  chartPreviousClose?: number;
}

interface YahooChartResult {
  meta?: YahooChartMeta;
}

interface YahooChartResponse {
  chart?: {
    result?: YahooChartResult[];
  };
}

const STATIC_FALLBACK_PRICES: Record<string, number> = {
  'SAVANIFINL.BO': 14.86,
  'BLSE.BO': 152.9,
  'KPIGREEN.BO': 402.4,
  'GENSOL.BO': 372.6,
  'HARIOMPIPE.BO': 355.75,
  'CLEAN.BO': 1237.45,
  'FINEORG.BO': 3743,
};

// Track which tickers used fallback — [exposed in API response]
export const FALLBACK_TICKERS = new Set<string>();

@Injectable()
export class YahooFinanceProvider {
  private readonly logger = new Logger(YahooFinanceProvider.name);
  private readonly HOSTS = [
    'https://query1.finance.yahoo.com',
    'https://query2.finance.yahoo.com',
  ];

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async getCMP(
    ticker: string,
  ): Promise<{ price: number | null; isFallback: boolean }> {
    const cacheKey = `cmp:${ticker}`;
    const cached = await this.cacheManager.get<{
      price: number;
      isFallback: boolean;
    }>(cacheKey);
    if (cached !== undefined && cached !== null) {
      this.logger.debug(`Cache HIT for ${ticker}`);
      return cached;
    }

    // Try live fetch
    const livePrice = await this.fetchFromYahoo(ticker);
    if (livePrice !== null) {
      const result = { price: livePrice, isFallback: false };
      await this.cacheManager.set(cacheKey, result);
      FALLBACK_TICKERS.delete(ticker);
      return result;
    }

    // .NS → .BO auto-retry
    if (ticker.endsWith('.NS')) {
      const boTicker = ticker.replace('.NS', '.BO');
      this.logger.warn(`Retrying ${ticker} as BSE: ${boTicker}`);
      const boPrice = await this.fetchFromYahoo(boTicker);
      if (boPrice !== null) {
        const result = { price: boPrice, isFallback: false };
        await this.cacheManager.set(cacheKey, result);
        return result;
      }
    }

    //  Static fallback
    const fallbackPrice =
      STATIC_FALLBACK_PRICES[ticker] ??
      STATIC_FALLBACK_PRICES[ticker.replace('.NS', '.BO')] ??
      null;

    if (fallbackPrice !== null) {
      this.logger.warn(`Using static fallback for ${ticker}: ${fallbackPrice}`);
      FALLBACK_TICKERS.add(ticker);
      const result = { price: fallbackPrice, isFallback: true };
      await this.cacheManager.set(cacheKey, result, 60_000);
      return result;
    }

    return { price: null, isFallback: false };
  }

  private async fetchFromYahoo(ticker: string): Promise<number | null> {
    for (const host of this.HOSTS) {
      try {
        const response = await axios.get<YahooChartResponse>(
          `${host}/v8/finance/chart/${ticker}`,
          {
            params: { interval: '1m', range: '1d' },
            headers: {
              'User-Agent':
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
              Accept: 'application/json, text/plain, */*',
              'Accept-Language': 'en-US,en;q=0.9',
              'Accept-Encoding': 'gzip, deflate, br',
              Referer: 'https://finance.yahoo.com',
              Origin: 'https://finance.yahoo.com',
            },
            timeout: 8000,
          },
        );

        const meta = response.data?.chart?.result?.[0]?.meta;
        const price: number | undefined =
          meta?.regularMarketPrice ??
          meta?.previousClose ??
          meta?.chartPreviousClose;

        if (price && !isNaN(price)) {
          this.logger.log(`✅ ${ticker} → ₹${price} (via ${host})`);
          return price;
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        const status =
          typeof err === 'object' &&
          err !== null &&
          'response' in err &&
          typeof (err as { response?: { status?: unknown } }).response
            ?.status === 'number'
            ? String((err as { response: { status: number } }).response.status)
            : message;
        this.logger.warn(`${host} failed for ${ticker}: ${status}`);
      }
    }
    return null;
  }
}
