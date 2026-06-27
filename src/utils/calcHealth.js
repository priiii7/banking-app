/**
 * Calculates a user's financial health score based on their
 * ratio of impulse to total spending.
 *
 * @param {Array} transactions - Array of transaction objects
 * @returns {"healthy" | "moderate" | "struggling"}
 */
export function calcHealth(transactions) {
  const impulseSpend = transactions
    .filter((t) => t.mood === "impulse" && t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const totalSpend = transactions
    .filter((t) => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const ratio = impulseSpend / (totalSpend || 1);

  if (ratio > 0.5)  return "struggling";
  if (ratio > 0.25) return "moderate";
  return "healthy";
}
