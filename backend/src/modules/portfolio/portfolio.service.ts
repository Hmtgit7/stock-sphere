import { Injectable, Logger } from '@nestjs/common';
import { MarketDataService } from '../market-data/market-data.service';
import { PORTFOLIO_HOLDINGS, SOLD_HOLDINGS } from './portfolio.data';
import {
  EnrichedHolding,
  Holding,
  SoldHolding,
} from './entities/holding.entity';

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
export class PortfolioService {
  private readonly logger = new Logger(PortfolioService.name);

  constructor(private readonly marketDataService: MarketDataService) {}

  async getEnrichedPortfolio(): Promise<PortfolioResponse> {
    const holdings = PORTFOLIO_HOLDINGS;
    const totalInvestment = holdings.reduce(
      (sum, h) => sum + h.purchasePrice * h.quantity,
      0,
    );

    // Enrich all holdings in parallel — allSettled never throws
    const settled = await Promise.allSettled(
      holdings.map((h) => this.enrichHolding(h, totalInvestment)),
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
    const totalGainLossPct = (totalGainLoss / totalInvestment) * 100;
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
      totalGainLossPct: Math.round(totalGainLossPct * 100) / 100,
      totalRealizedPnL,
      // Assignment requirement: acknowledge unofficial data sources
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
    const portfolioPct = (investment / totalInvestment) * 100;

    // Parallel fetch — CMP and fundamentals simultaneously
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
      investment: Math.round(investment * 100) / 100,
      portfolioPct: Math.round(portfolioPct * 100) / 100,
      cmp,
      presentValue:
        presentValue !== null ? Math.round(presentValue * 100) / 100 : null,
      gainLoss: gainLoss !== null ? Math.round(gainLoss * 100) / 100 : null,
      gainLossPct:
        gainLossPct !== null ? Math.round(gainLossPct * 100) / 100 : null,
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
      portfolioPct: Math.round((investment / totalInvestment) * 10000) / 100,
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
        totalInvestment: Math.round(totalInvestment * 100) / 100,
        totalPresentValue: Math.round(totalPresentValue * 100) / 100,
        gainLoss: Math.round(gainLoss * 100) / 100,
        gainLossPct: Math.round((gainLoss / totalInvestment) * 10000) / 100,
        holdings: items,
      };
    });
  }
}
