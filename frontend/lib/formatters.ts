export function formatCurrency(value: number | null, decimals = 2): string {
  if (value === null) return '—';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: decimals,
  }).format(value);
}

export function formatNumber(value: number | null, decimals = 2): string {
  if (value === null) return '—';
  return new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: decimals,
  }).format(value);
}

export function formatPct(value: number | null): string {
  if (value === null) return '—';
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}
