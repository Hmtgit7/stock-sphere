export interface ApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
}

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
  isFallbackPrice: boolean;
  lastUpdated: string;
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
