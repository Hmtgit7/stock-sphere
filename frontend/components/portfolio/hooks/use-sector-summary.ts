'use client';

import { useMemo } from 'react';
import type { EnrichedHolding, SectorSummary } from '@/types/portfolio';

export function useSectorSummary(holdings: EnrichedHolding[]): SectorSummary[] {
  return useMemo(() => {
    const map = new Map<string, EnrichedHolding[]>();
    for (const h of holdings) {
      map.set(h.sector, [...(map.get(h.sector) ?? []), h]);
    }

    return Array.from(map.entries()).map(([sector, items]) => {
      const totalInvestment = items.reduce((s, h) => s + h.investment, 0);
      const totalPresentValue = items.reduce((s, h) => s + (h.presentValue ?? h.investment), 0);
      const gainLoss = totalPresentValue - totalInvestment;
      return {
        sector,
        totalInvestment: Math.round(totalInvestment * 100) / 100,
        totalPresentValue: Math.round(totalPresentValue * 100) / 100,
        gainLoss: Math.round(gainLoss * 100) / 100,
        gainLossPct:
          totalInvestment > 0 ? Math.round((gainLoss / totalInvestment) * 10_000) / 100 : 0,
        holdings: items,
      };
    });
  }, [holdings]);
}
