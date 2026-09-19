// Single source of truth for category accent colors. Previously this exact
// type + Record pair was independently redeclared in five different files
// (Section, NewsCard, the category page, the archive page, the story page)
// — centralizing it here now that the redesign needs both a background and
// a text variant of each color (chips, index numbers, hover states).
export type AccentColor = "accent" | "teal" | "amber" | "slate" | "pink" | "blue";

const BG: Record<AccentColor, string> = {
  accent: "bg-accent",
  teal: "bg-teal",
  amber: "bg-amber",
  slate: "bg-slate",
  pink: "bg-pink",
  blue: "bg-blue"
};

const TEXT: Record<AccentColor, string> = {
  accent: "text-accent",
  teal: "text-teal",
  amber: "text-amber",
  slate: "text-slate",
  pink: "text-pink",
  blue: "text-blue"
};

export function accentBg(color: AccentColor): string {
  return BG[color] ?? BG.accent;
}

export function accentText(color: AccentColor): string {
  return TEXT[color] ?? TEXT.accent;
}
