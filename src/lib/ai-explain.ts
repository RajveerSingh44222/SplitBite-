import type { AutoOrderFacts, ReminderFacts, RestaurantRecommendationFacts } from "@/lib/ai-scoring";

/**
 * The scoring/picking logic in `ai-scoring.ts` is 100% rule-based and
 * synchronous. This file is the only place that talks to an LLM — and only
 * to turn the *facts* that logic already produced into one natural sentence.
 * The model never chooses anything; it only explains a choice that was
 * already made.
 *
 * Every function here returns instantly with a deterministic template
 * (`buildFallbackExplanation`), so the UI never blocks on the network. Call
 * sites can optionally call `explainWithAI` afterwards to upgrade that text
 * once the model responds — see `useAIExplanation` below for the common case.
 */

export type ExplainKind = "auto-order" | "restaurant-pick" | "reminder";

export type ExplainFacts = AutoOrderFacts | RestaurantRecommendationFacts | ReminderFacts;

export function buildFallbackExplanation(kind: ExplainKind, facts: ExplainFacts): string {
  switch (kind) {
    case "auto-order": {
      const f = facts as AutoOrderFacts;
      const cuisineBit = f.matchedCuisine ? `frequently orders ${f.matchedCuisine} food` : "has ordered here before";
      return `This meal was selected because ${f.userName} ${cuisineBit}, and ${f.pickedItemName} from ${f.restaurantName} fits within the ${formatRupee(
        f.budgetPerPerson
      )} budget.`;
    }
    case "restaurant-pick": {
      const f = facts as RestaurantRecommendationFacts;
      const bits = [
        f.fitsBudget ? "fits your budget per person" : "is slightly above budget but well rated",
        `${f.rating}★ rating`,
        `${f.deliveryTimeMins}-minute delivery`,
      ];
      return `${f.restaurantName} was recommended because it ${bits.join(", ")}.`;
    }
    case "reminder": {
      const f = facts as ReminderFacts;
      if (f.restaurantName) {
        const cuisineBit = f.matchedCuisine ? `Your favourite ${f.matchedCuisine} spot` : `${f.restaurantName}`;
        return `${f.userName}, only ${f.minutesLeft} min left! ${cuisineBit} — ${f.restaurantName} — is available and fits your ${formatRupee(
          f.budgetPerPerson
        )} budget.`;
      }
      return `${f.userName}, only ${f.minutesLeft} min left to place your order!`;
    }
    default:
      return "";
  }
}

function formatRupee(amount: number): string {
  return `\u20b9${Math.round(amount).toLocaleString("en-IN")}`;
}

/**
 * Calls the server route which asks an LLM to rephrase the facts as one
 * short, friendly sentence. Falls back to the deterministic template on any
 * error (missing API key, network failure, timeout) so this can never break
 * the UI — it can only make the copy nicer.
 */
export async function explainWithAI(kind: ExplainKind, facts: ExplainFacts): Promise<string> {
  const fallback = buildFallbackExplanation(kind, facts);
  try {
    const res = await fetch("/api/ai/explain", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind, facts }),
    });
    if (!res.ok) return fallback;
    const data = (await res.json()) as { text?: string };
    return data.text?.trim() || fallback;
  } catch {
    return fallback;
  }
}
