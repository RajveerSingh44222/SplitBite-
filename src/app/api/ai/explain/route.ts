import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/ai/explain
 *
 * Body: { kind: "auto-order" | "restaurant-pick" | "reminder", facts: {...} }
 *
 * This route does NOT decide anything — the pick already happened client-side
 * via the rule-based logic in `src/lib/ai-scoring.ts`. All this does is ask
 * an LLM to phrase the given facts as one short, natural sentence. If
 * ANTHROPIC_API_KEY isn't configured, or the call fails for any reason, we
 * return { text: null } and the client falls back to its own deterministic
 * template — so this endpoint is a pure enhancement, never a dependency.
 */

const SYSTEM_PROMPT =
  "You write a single short, friendly sentence (max 25 words) explaining why a food/restaurant recommendation was made, based only on the facts given. No greeting, no preamble, no quotes around the sentence, just the sentence itself.";

function promptFor(kind: string, facts: Record<string, unknown>): string {
  return `Recommendation type: ${kind}\nFacts (JSON): ${JSON.stringify(facts)}\n\nWrite the one-sentence explanation now.`;
}

export async function POST(req: NextRequest) {
  let body: { kind?: string; facts?: Record<string, unknown> };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ text: null, error: "invalid_json" }, { status: 400 });
  }

  const { kind, facts } = body;
  if (!kind || !facts) {
    return NextResponse.json({ text: null, error: "missing_fields" }, { status: 400 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    // No key configured — let the client use its own fallback template.
    return NextResponse.json({ text: null, source: "no-key" });
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 100,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: promptFor(kind, facts) }],
      }),
      // Explanations are a nice-to-have — don't let a slow model call hang the UI.
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) {
      return NextResponse.json({ text: null, source: "api-error" });
    }

    const data = await response.json();
    const text = data?.content?.find((b: { type: string }) => b.type === "text")?.text as string | undefined;
    return NextResponse.json({ text: text ?? null, source: "llm" });
  } catch {
    return NextResponse.json({ text: null, source: "exception" });
  }
}
