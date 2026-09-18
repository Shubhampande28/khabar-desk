import { Article } from "./types";

// There's no database, so a story page's slug encodes everything it needs
// to render directly in the URL — title, link, source, date, image,
// excerpt and category. That keeps every /story/... page self-contained
// and correct forever, even after the source RSS feed rotates the article
// out entirely.
export type StoryPayload = {
  t: string;
  l: string;
  s: string;
  d: string | null;
  i: string | null;
  c: string | null;
  cs: string;
  cl: string;
  ac: string;
};

// Buffer only exists in Node. encodeStorySlug is now also called from a
// client component (Ticker), so this needs to work in the browser too —
// fall back to btoa/atob with the standard UTF-8-safe wrapping.
function toBase64Url(str: string): string {
  const base64 =
    typeof Buffer !== "undefined"
      ? Buffer.from(str, "utf-8").toString("base64")
      : btoa(unescape(encodeURIComponent(str)));
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(encoded: string): string {
  const base64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
  return typeof Buffer !== "undefined"
    ? Buffer.from(padded, "base64").toString("utf-8")
    : decodeURIComponent(escape(atob(padded)));
}

function slugifyTitle(title: string): string {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
  return slug || "story";
}

export function encodeStorySlug(
  article: Article,
  category: { slug: string; label: string; color: string }
): string {
  const payload: StoryPayload = {
    t: article.title,
    l: article.link,
    s: article.source,
    d: article.isoDate,
    i: article.image,
    c: article.contentSnippet,
    cs: category.slug,
    cl: category.label,
    ac: category.color
  };
  const encoded = toBase64Url(JSON.stringify(payload));
  // A "." separator is safe: the title slug only ever contains lowercase
  // letters, digits and single dashes, and base64url never contains ".".
  return `${slugifyTitle(article.title)}.${encoded}`;
}

export function decodeStorySlug(slug: string): StoryPayload | null {
  const dotIndex = slug.lastIndexOf(".");
  if (dotIndex === -1) return null;
  try {
    const json = fromBase64Url(slug.slice(dotIndex + 1));
    return JSON.parse(json) as StoryPayload;
  } catch {
    return null;
  }
}
