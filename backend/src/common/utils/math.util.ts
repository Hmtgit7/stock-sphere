/** Round a number to 2 decimal places. */
export function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

/** Round to an arbitrary decimal places. */
export function roundTo(value: number, decimals: number): number {
  const f = Math.pow(10, decimals);
  return Math.round(value * f) / f;
}
