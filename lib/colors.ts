// Single source of truth for category accent colors — previously this
// exact type + Record pair was independently redeclared in five different
// files. Each category now has its own literal color (matching its badge
// color from the design spec), rather than an arbitrary shared palette of
// generic color names.
export type AccentColor =
  | "accent"
  | "entertainment"
  | "bollywood"
  | "hollywood"
  | "crime"
  | "politics"
  | "business"
  | "markets"
  | "startups";

const BG: Record<AccentColor, string> = {
  accent: "bg-accent",
  entertainment: "bg-entertainment",
  bollywood: "bg-bollywood",
  hollywood: "bg-hollywood",
  crime: "bg-crime",
  politics: "bg-politics",
  business: "bg-business",
  markets: "bg-markets",
  startups: "bg-startups"
};

const TEXT: Record<AccentColor, string> = {
  accent: "text-accent",
  entertainment: "text-entertainment",
  bollywood: "text-bollywood",
  hollywood: "text-hollywood",
  crime: "text-crime",
  politics: "text-politics",
  business: "text-business",
  markets: "text-markets",
  startups: "text-startups"
};

export function accentBg(color: AccentColor): string {
  return BG[color] ?? BG.accent;
}

export function accentText(color: AccentColor): string {
  return TEXT[color] ?? TEXT.accent;
}
