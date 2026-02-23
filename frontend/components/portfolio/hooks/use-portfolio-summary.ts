'use client';

import { useMemo } from 'react';
import type { PortfolioResponse } from '@/types/portfolio';

export interface PortfolioSummary {
  totalInvestment: number;
  totalPresentValue: number;
  totalGainLoss: number;
  totalGainLossPct: number;
  totalRealizedPnL: number;
  holdingCount: number;
  sectorCount: number;
  isPositive: boolean;
}

export function usePortfolioSummary(data: PortfolioResponse | null): PortfolioSummary | null {
  return useMemo(() => {
    if (!data) return null;
    return {
      totalInvestment: data.totalInvestment,
      totalPresentValue: data.totalPresentValue,
      totalGainLoss: data.totalGainLoss,
      totalGainLossPct: data.totalGainLossPct,
      totalRealizedPnL: data.totalRealizedPnL,
      holdingCount: data.holdings.length,
      sectorCount: data.sectors.length,
      isPositive: data.totalGainLoss >= 0,
    };
  }, [data]);
}
