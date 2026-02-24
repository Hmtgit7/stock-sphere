export interface BreakdownTooltipPayload {
  name: string;
  value: number;
  payload: { totalInvestment: number; totalPresentValue: number };
}

export interface BreakdownTooltipEntry {
  active?: boolean;
  payload?: BreakdownTooltipPayload[];
}

export interface BreakdownTooltipData {
  name: string;
  invested: number;
  presentValue: number;
  isProfit: boolean;
}

/**
 * Derives display data from a Recharts tooltip payload for the portfolio
 * breakdown pie chart. Returns `null` when the tooltip is not active or
 * has no data.
 */
export function usePortfolioBreakdownTooltip({
  active,
  payload,
}: BreakdownTooltipEntry): BreakdownTooltipData | null {
  if (!active || !payload?.length) return null;
  const { name, payload: p } = payload[0];
  return {
    name,
    invested: p.totalInvestment,
    presentValue: p.totalPresentValue,
    isProfit: p.totalPresentValue >= p.totalInvestment,
  };
}
