import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind class names safely, resolving conflicts.
 * Thin wrapper around clsx + tailwind-merge.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Return the Tailwind text-colour class for a gain/loss value.
 * Positive → green, negative → red, null → muted secondary.
 */
export function gainLossClass(value: number | null): string {
  if (value === null) return 'text-[var(--text-secondary)]';
  return value >= 0 ? 'text-[var(--accent-green)]' : 'text-[var(--accent-red)]';
}
