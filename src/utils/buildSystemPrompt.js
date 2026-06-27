import { calcHealth } from "./calcHealth";

/**
 * Builds a dynamic Claude system prompt tailored to the
 * user's current financial health score.
 *
 * @param {Array} transactions - Array of transaction objects
 * @returns {string} System prompt string for the Claude API
 */
export function buildSystemPrompt(transactions) {
  const health = calcHealth(transactions);

  const totalSpent = transactions
    .filter((t) => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const impulseCount = transactions.filter((t) => t.mood === "impulse").length;

  const tone = {
    struggling: "Be warm but firm. The user overspends on impulse. Give concrete steps.",
    moderate:   "Be encouraging. User is doing okay. Suggest one improvement at a time.",
    healthy:    "Be forward-looking. Help them optimize and grow wealth.",
  }[health];

  return `You are a concise AI financial advisor embedded in a banking app. ${tone}

USER DATA:
- Balance: $12,480.55
- Monthly income: $4,200
- Spent this month: $${totalSpent.toFixed(0)}
- Impulse purchases: ${impulseCount}
- Financial health: ${health}
- Recent transactions: ${JSON.stringify(transactions.slice(0, 6))}

RULES:
- Keep replies under 4 sentences unless asked for detail
- Always reference actual numbers from the user's data
- Never give generic advice — tailor everything to this user
- Use emojis sparingly (max 1 per response)
- End with one actionable next step when relevant`;
}
