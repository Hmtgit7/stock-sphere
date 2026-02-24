export interface TooltipEntry {
  active?: boolean;
  payload?: { value?: number }[];
  label?: string;
}

export interface GainLossTooltipData {
  value: number;
  isPositive: boolean;
  label: string | undefined;
}

/**
 * Derives display data from a Recharts tooltip payload.
 * Returns `null` when the tooltip is not active or has no data.
 */
export function useGainLossTooltip({
  active,
  payload,
  label,
}: TooltipEntry): GainLossTooltipData | null {
  if (!active || !payload?.length) return null;
  const value = payload[0].value ?? 0;
  const isPositive = value >= 0;
  return { value, isPositive, label };
}
