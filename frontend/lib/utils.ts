import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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

export function gainLossClass(value: number | null): string {
  if (value === null) return 'text-[var(--text-secondary)]';
  return value >= 0 ? 'text-[var(--accent-green)]' : 'text-[var(--accent-red)]';
}
