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
  gainLossPct: number | null; // ← new: server-computed %
  peRatio: number | null;
  latestEarnings: string | null;
  isFallbackPrice: boolean; // ← new: shows ~ on CMP
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
  gainLossPct: number; // ← new: server-computed %
  holdings: EnrichedHolding[];
}

export interface PortfolioResponse {
  holdings: EnrichedHolding[];
  sectors: SectorSummary[];
  soldHoldings: SoldHolding[]; // ← new: exited positions
  totalInvestment: number;
  totalPresentValue: number;
  totalGainLoss: number;
  totalGainLossPct: number; // ← new
  totalRealizedPnL: number; // ← new: sum of sold P&L
  dataDisclaimer: string; // ← new: assignment requirement
  lastUpdated: string;
}
