export interface Holding {
  id: string;
  particulars: string;
  sector: string;
  exchange: 'NSE' | 'BSE';
  ticker: string;
  googleTicker: string;
  purchasePrice: number;
  quantity: number;
  marketCap?: number | null;
  debtToEquity?: number | null;
  stage2?: boolean | null;
}

export interface EnrichedHolding extends Holding {
  investment: number;
  portfolioPct: number;
  cmp: number | null;
  presentValue: number | null;
  gainLoss: number | null;
  gainLossPct: number | null;
  peRatio: number | null;
  latestEarnings: string | null;
  lastUpdated: string;
  isFallbackPrice: boolean; // true when static fallback was used
}

export interface SoldHolding {
  id: string;
  particulars: string;
  ticker: string;
  sector: string;
  purchasePrice: number;
  quantity: number;
  soldPrice: number;
  investment: number;
  saleValue: number;
  realizedPnL: number;
  realizedPnLPct: number;
}
