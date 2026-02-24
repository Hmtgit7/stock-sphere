'use client';

import { useMemo } from 'react';
import { round } from '@/lib/calculations';
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
        totalInvestment: round(totalInvestment),
        totalPresentValue: round(totalPresentValue),
        gainLoss: round(gainLoss),
        gainLossPct: totalInvestment > 0 ? round((gainLoss / totalInvestment) * 100) : 0,
        holdings: items,
      };
    });
  }, [holdings]);
}
