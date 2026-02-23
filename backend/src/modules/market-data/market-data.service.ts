import { Injectable } from '@nestjs/common';
import { YahooFinanceProvider } from './providers/yahoo-finance.provider';
import {
  FundamentalData,
  GoogleFinanceProvider,
} from './providers/google-finance.provider';
import { STATIC_FUNDAMENTALS } from '../portfolio/portfolio.data';

export interface CMPResult {
  price: number | null;
  isFallback: boolean;
}

@Injectable()
export class MarketDataService {
  constructor(
    private readonly yahooProvider: YahooFinanceProvider,
    private readonly googleProvider: GoogleFinanceProvider,
  ) {}

  getCMP(ticker: string): Promise<CMPResult> {
    return this.yahooProvider.getCMP(ticker);
  }

  async getFundamentals(googleTicker: string): Promise<FundamentalData> {
    const live = await this.googleProvider.getFundamentals(googleTicker);
    const staticData = STATIC_FUNDAMENTALS[googleTicker];

    // Patch any null fields from static Excel data
    return {
      peRatio: live.peRatio ?? staticData?.peRatio ?? null,
      latestEarnings: live.latestEarnings ?? staticData?.latestEarnings ?? null,
    };
  }
}
