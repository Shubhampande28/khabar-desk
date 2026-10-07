// Pluggable AI draft provider for the admin "Draft with AI" button. Only
// ever sees a headline + the feed's own short description — never fetches
// or scrapes the source article, per the editorial rules below.

export type DraftInput = {
  headline: string;
  feedSummary: string | null;
  sourceName: string;
  category: string;
};

export type DraftOutput = {
  ourSummary: string;
  whyItMatters: string;
};

export interface DraftProvider {
  generate(input: DraftInput): Promise<DraftOutput>;
}

const SYSTEM_PROMPT = `You are an editorial assistant for Khabar Adda, an Indian news aggregator. You are given ONLY a headline and a short feed description for a story — never the full article, and you must not invent or assume facts beyond what's given.

Write two things, in Indian English, in a neutral, factual, non-sensational tone:
1. "ourSummary": 2-4 sentences restating what the headline/description say, in our own words. Attribute claims to their source, e.g. "according to <source>". Under 80 words total.
2. "whyItMatters": 1-2 sentences on why a reader should care, staying strictly within what the input supports — no speculation.

Hard rules:
- Never name a victim of a crime or assault.
- Never describe the method of a suicide, even if the input mentions it.
- Never add any fact, number, name, or quote that isn't already in the headline or description.
- If the input is too thin to say anything beyond the headline, keep ourSummary short rather than padding it with invented detail.

Respond with strict JSON only: {"ourSummary": "...", "whyItMatters": "..."}`;

function userPrompt(input: DraftInput): string {
  return [
    `Category: ${input.category}`,
    `Source: ${input.sourceName}`,
    `Headline: ${input.headline}`,
    `Feed description: ${input.feedSummary || "(none provided)"}`
  ].join("\n");
}

class OpenAIDraftProvider implements DraftProvider {
  private apiKey: string;
  private model: string;

  constructor() {
    const key = process.env.OPENAI_API_KEY;
    if (!key) throw new Error("OPENAI_API_KEY is not set");
    this.apiKey = key;
    this.model = process.env.OPENAI_MODEL || "gpt-4o-mini";
  }

  async generate(input: DraftInput): Promise<DraftOutput> {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: this.model,
        temperature: 0.3,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt(input) }
        ]
      })
    });

    if (!res.ok) {
      const body = await res.text();
      throw new Error(`OpenAI draft request failed (${res.status}): ${body}`);
    }

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) throw new Error("OpenAI response had no content");

    const parsed = JSON.parse(content) as Partial<DraftOutput>;
    if (!parsed.ourSummary || !parsed.whyItMatters) {
      throw new Error("OpenAI response missing ourSummary/whyItMatters");
    }
    return { ourSummary: parsed.ourSummary, whyItMatters: parsed.whyItMatters };
  }
}

export function getDraftProvider(): DraftProvider {
  const provider = process.env.AI_PROVIDER || "openai";
  switch (provider) {
    case "openai":
      return new OpenAIDraftProvider();
    default:
      throw new Error(`Unknown AI_PROVIDER: "${provider}"`);
  }
}
