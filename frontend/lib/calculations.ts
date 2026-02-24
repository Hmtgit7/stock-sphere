export function calculateInvestment(purchasePrice: number, quantity: number): number {
  return purchasePrice * quantity;
}

export function calculatePresentValue(cmp: number | null, quantity: number): number | null {
  if (cmp === null) return null;
  return cmp * quantity;
}

export function calculateGainLoss(presentValue: number | null, investment: number): number | null {
  if (presentValue === null) return null;
  return presentValue - investment;
}

export function calculateGainLossPct(gainLoss: number | null, investment: number): number | null {
  if (gainLoss === null || investment === 0) return null;
  return (gainLoss / investment) * 100;
}

export function calculatePortfolioPct(investment: number, totalInvestment: number): number {
  if (totalInvestment === 0) return 0;
  return (investment / totalInvestment) * 100;
}

export function round(value: number, decimals = 2): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}
