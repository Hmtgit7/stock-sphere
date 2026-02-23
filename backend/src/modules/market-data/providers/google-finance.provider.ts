import { Injectable, Logger } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { toErrorMessage } from '../../../common/utils/error.util';

export interface FundamentalData {
  peRatio: number | null;
  latestEarnings: string | null;
}

@Injectable()
export class GoogleFinanceProvider {
  private readonly logger = new Logger(GoogleFinanceProvider.name);
  private readonly BASE_URL = 'https://www.google.com/finance/quote';

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async getFundamentals(googleTicker: string): Promise<FundamentalData> {
    const cacheKey = `fundamentals:${googleTicker}`;
    const cached = await this.cacheManager.get<FundamentalData>(cacheKey);
    if (cached) return cached;

    const url = `${this.BASE_URL}/${googleTicker}`;

    try {
      const { data: html } = await axios.get<string>(url, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept-Language': 'en-US,en;q=0.9',
          Accept:
            'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        },
        timeout: 10000,
      });

      const $ = cheerio.load(html);
      let peRatio: number | null = null;
      let latestEarnings: string | null = null;

      // Try multiple selectors — Google Finance layout can vary.
      $('[data-attid]').each((_, el) => {
        const label = $(el).find('.mfs7Fc').text().trim().toLowerCase();
        const value = $(el).find('.P6K39c').text().trim();

        if (label.includes('p/e ratio') || label.includes('price/earnings')) {
          const parsed = parseFloat(value.replace(/,/g, ''));
          if (!isNaN(parsed)) peRatio = parsed;
        }
        if (label.includes('eps') || label.includes('earnings per share')) {
          latestEarnings = value || null;
        }
      });

      // Fallback: some layouts use plainer DOM structure.
      if (peRatio === null) {
        $('div').each((_, el) => {
          const text = $(el).text().trim();
          if (text.toLowerCase() === 'p/e ratio') {
            const sibling = $(el).next().text().trim();
            const parsed = parseFloat(sibling.replace(/,/g, ''));
            if (!isNaN(parsed)) peRatio = parsed;
          }
        });
      }

      const result: FundamentalData = { peRatio, latestEarnings };
      await this.cacheManager.set(cacheKey, result, 300_000); // 5 min TTL
      this.logger.log(
        `✅ Fundamentals for ${googleTicker} → P/E: ${peRatio}, EPS: ${latestEarnings}`,
      );
      return result;
    } catch (err: unknown) {
      this.logger.error(
        `Google Finance error for ${googleTicker}: ${toErrorMessage(err)}`,
      );
      return { peRatio: null, latestEarnings: null };
    }
  }
}
