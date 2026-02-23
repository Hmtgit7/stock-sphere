import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { MarketDataService } from '../market-data/market-data.service';
import { PORTFOLIO_HOLDINGS, SOLD_HOLDINGS } from './portfolio.data';
import {
  EnrichedHolding,
  Holding,
  SoldHolding,
} from './entities/holding.entity';
import { round2 } from '../../common/utils/math.util';

// Simple semaphore — caps concurrent outbound API calls to avoid Yahoo/Google rate-limits.
class ConcurrencyLimiter {
  private active = 0;
  private readonly queue: Array<() => void> = [];

  constructor(private readonly concurrency: number) {}

  async run<T>(task: () => Promise<T>): Promise<T> {
    await this.acquire();
    try {
      return await task();
    } finally {
      this.release();
    }
  }

  private acquire(): Promise<void> {
    if (this.active < this.concurrency) {
      this.active++;
      return Promise.resolve();
    }
    return new Promise((resolve) => this.queue.push(resolve));
  }

  private release(): void {
    const next = this.queue.shift();
    if (next) next();
    else this.active--;
  }
}

export interface SectorSummary {
  sector: string;
  totalInvestment: number;
  totalPresentValue: number;
  gainLoss: number;
  gainLossPct: number;
  holdings: EnrichedHolding[];
}

export interface PortfolioResponse {
  holdings: EnrichedHolding[];
  sectors: SectorSummary[];
  soldHoldings: SoldHolding[];
  totalInvestment: number;
  totalPresentValue: number;
  totalGainLoss: number;
  totalGainLossPct: number;
  totalRealizedPnL: number;
  dataDisclaimer: string;
  lastUpdated: string;
}

@Injectable()
export class PortfolioService implements OnApplicationBootstrap {
  private readonly logger = new Logger(PortfolioService.name);

  private readonly limiter = new ConcurrencyLimiter(5);

  constructor(private readonly marketDataService: MarketDataService) {}

  // Pre-warm cache on startup so the first request is served instantly.
  async onApplicationBootstrap(): Promise<void> {
    this.logger.log('Warming portfolio cache on startup…');
    try {
      await this.getEnrichedPortfolio();
      this.logger.log('Cache warm-up complete.');
    } catch (err) {
      this.logger.warn(`Cache warm-up failed: ${String(err)}`);
    }
  }

  async getEnrichedPortfolio(): Promise<PortfolioResponse> {
    const holdings = PORTFOLIO_HOLDINGS;
    const totalInvestment = holdings.reduce(
      (sum, h) => sum + h.purchasePrice * h.quantity,
      0,
    );

    const settled = await Promise.allSettled(
      holdings.map((h) =>
        this.limiter.run(() => this.enrichHolding(h, totalInvestment)),
      ),
    );

    const enrichedHoldings: EnrichedHolding[] = settled.map((result, i) => {
      if (result.status === 'fulfilled') return result.value;
      this.logger.warn(
        `Failed to enrich ${holdings[i].ticker}: ${result.reason}`,
      );
      return this.buildFallbackHolding(holdings[i], totalInvestment);
    });

    const totalPresentValue = enrichedHoldings.reduce(
      (sum, h) => sum + (h.presentValue ?? h.investment),
      0,
    );
    const totalGainLoss = totalPresentValue - totalInvestment;
    const totalRealizedPnL = SOLD_HOLDINGS.reduce(
      (sum, s) => sum + s.realizedPnL,
      0,
    );

    return {
      holdings: enrichedHoldings,
      sectors: this.groupBySector(enrichedHoldings),
      soldHoldings: SOLD_HOLDINGS,
      totalInvestment,
      totalPresentValue,
      totalGainLoss,
      totalGainLossPct: round2((totalGainLoss / totalInvestment) * 100),
      totalRealizedPnL,
      dataDisclaimer:
        'Prices sourced from unofficial Yahoo Finance & Google Finance endpoints. Data is indicative only and not financial advice.',
      lastUpdated: new Date().toISOString(),
    };
  }

  private async enrichHolding(
    holding: Holding,
    totalInvestment: number,
  ): Promise<EnrichedHolding> {
    const investment = holding.purchasePrice * holding.quantity;

    const [cmpResult, fundamentalData] = await Promise.allSettled([
      this.marketDataService.getCMP(holding.ticker),
      this.marketDataService.getFundamentals(holding.googleTicker),
    ]);

    const cmpData =
      cmpResult.status === 'fulfilled'
        ? cmpResult.value
        : { price: null, isFallback: false };
    const fundamentals =
      fundamentalData.status === 'fulfilled' ? fundamentalData.value : null;

    const cmp = cmpData.price;
    const presentValue = cmp !== null ? cmp * holding.quantity : null;
    const gainLoss = presentValue !== null ? presentValue - investment : null;
    const gainLossPct =
      gainLoss !== null ? (gainLoss / investment) * 100 : null;

    return {
      ...holding,
      investment: round2(investment),
      portfolioPct: round2((investment / totalInvestment) * 100),
      cmp,
      presentValue: presentValue !== null ? round2(presentValue) : null,
      gainLoss: gainLoss !== null ? round2(gainLoss) : null,
      gainLossPct: gainLossPct !== null ? round2(gainLossPct) : null,
      peRatio: fundamentals?.peRatio ?? null,
      latestEarnings: fundamentals?.latestEarnings ?? null,
      isFallbackPrice: cmpData.isFallback,
      lastUpdated: new Date().toISOString(),
    };
  }

  private buildFallbackHolding(
    holding: Holding,
    totalInvestment: number,
  ): EnrichedHolding {
    const investment = holding.purchasePrice * holding.quantity;
    return {
      ...holding,
      investment,
      portfolioPct: round2((investment / totalInvestment) * 100),
      cmp: null,
      presentValue: null,
      gainLoss: null,
      gainLossPct: null,
      peRatio: null,
      latestEarnings: null,
      isFallbackPrice: false,
      lastUpdated: new Date().toISOString(),
    };
  }

  private groupBySector(holdings: EnrichedHolding[]): SectorSummary[] {
    const map = new Map<string, EnrichedHolding[]>();
    for (const h of holdings) {
      map.set(h.sector, [...(map.get(h.sector) ?? []), h]);
    }

    return Array.from(map.entries()).map(([sector, items]) => {
      const totalInvestment = items.reduce((s, h) => s + h.investment, 0);
      const totalPresentValue = items.reduce(
        (s, h) => s + (h.presentValue ?? h.investment),
        0,
      );
      const gainLoss = totalPresentValue - totalInvestment;
      return {
        sector,
        totalInvestment: round2(totalInvestment),
        totalPresentValue: round2(totalPresentValue),
        gainLoss: round2(gainLoss),
        gainLossPct: round2((gainLoss / totalInvestment) * 100),
        holdings: items,
      };
    });
  }
}
