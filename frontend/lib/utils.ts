/**
 * lib/utils.ts — barrel re-export.
 *
 * All utilities have been split into focused modules:
 *   lib/helpers.ts     — cn(), gainLossClass()
 *   lib/formatters.ts  — formatCurrency(), formatNumber(), formatPct()
 *   lib/calculations.ts — financial math helpers
 *   lib/constants.ts   — app-wide constants
 *
 * This file re-exports everything so existing imports (from '@/lib/utils') keep
 * working without modification.
 */
export * from './helpers';
export * from './formatters';
export * from './calculations';
export * from './constants';
