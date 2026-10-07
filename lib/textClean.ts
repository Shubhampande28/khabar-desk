import { decodeHTML } from "entities";

// RSS feeds routinely hand us titles/descriptions with HTML entities
// ("F&amp;O"), stray markup, and inconsistent whitespace — this is the one
// place that gets cleaned up before anything is stored or rendered.

function stripTags(value: string): string {
  return value.replace(/<[^>]*>/g, " ");
}

function collapseWhitespace(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

// Feeds mix straight quotes (incl. ones that arrive as &#39;/&quot;) with
// curly ones inconsistently — this makes the straight ones consistently
// curly so headlines don't look mismatched.
function smartenQuotes(value: string): string {
  return value
    .replace(/(^|[\s([{<])"/g, "$1“")
    .replace(/"/g, "”")
    .replace(/(^|[\s([{<])'/g, "$1‘")
    .replace(/'/g, "’");
}

// Order matters: strip real markup first (so escaped-but-not-real tags
// like "&lt;b&gt;" survive as text), then decode entities, then normalize.
function normalizeText(raw: string): string {
  const stripped = stripTags(raw);
  const decoded = decodeHTML(stripped);
  return smartenQuotes(collapseWhitespace(decoded));
}

export function cleanTitle(raw: string | null | undefined): string {
  if (!raw) return "";
  return normalizeText(raw);
}

export function truncateAtWordBoundary(value: string, maxLen = 300): string {
  if (value.length <= maxLen) return value;
  const cut = value.slice(0, maxLen);
  const lastSpace = cut.lastIndexOf(" ");
  const trimmed = lastSpace > 0 ? cut.slice(0, lastSpace) : cut;
  return `${trimmed.trimEnd()}…`;
}

export function cleanDescription(
  raw: string | null | undefined,
  maxLen = 300
): string | null {
  if (!raw) return null;
  const cleaned = normalizeText(raw);
  if (!cleaned) return null;
  return truncateAtWordBoundary(cleaned, maxLen);
}
