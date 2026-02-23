/**
 * Formatting utilities — pure functions, no side-effects.
 * Centralised here so every component uses the same locale / style.
 */

/** Format a number as Indian-rupee currency (₹). Returns "—" for null. */
export function formatCurrency(value: number | null, decimals = 2): string {
  if (value === null) return '—';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: decimals,
  }).format(value);
}

/** Format a number with Indian grouping. Returns "—" for null. */
export function formatNumber(value: number | null, decimals = 2): string {
  if (value === null) return '—';
  return new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Format a percentage value with a leading sign.
 * e.g.  12.5 → "+12.50%"   -3 → "-3.00%"   null → "—"
 */
export function formatPct(value: number | null): string {
  if (value === null) return '—';
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}
