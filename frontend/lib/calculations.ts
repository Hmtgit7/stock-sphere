/**
 * Financial calculation helpers — pure functions used by both UI and hooks.
 * Keeping these separate means business logic is testable in isolation.
 */

/** Investment = purchasePrice × quantity */
export function calculateInvestment(purchasePrice: number, quantity: number): number {
  return purchasePrice * quantity;
}

/** Present Value = cmp × quantity. Returns null when cmp is unavailable. */
export function calculatePresentValue(cmp: number | null, quantity: number): number | null {
  if (cmp === null) return null;
  return cmp * quantity;
}

/** Gain/Loss = presentValue – investment. Returns null when pv is unavailable. */
export function calculateGainLoss(presentValue: number | null, investment: number): number | null {
  if (presentValue === null) return null;
  return presentValue - investment;
}

/** Gain/Loss % = gainLoss / investment × 100. Returns null when gainLoss is unavailable. */
export function calculateGainLossPct(gainLoss: number | null, investment: number): number | null {
  if (gainLoss === null || investment === 0) return null;
  return (gainLoss / investment) * 100;
}

/** Portfolio weight = stockInvestment / totalPortfolioInvestment × 100 */
export function calculatePortfolioPct(investment: number, totalInvestment: number): number {
  if (totalInvestment === 0) return 0;
  return (investment / totalInvestment) * 100;
}

/** Round a number to given decimal places. */
export function round(value: number, decimals = 2): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}
