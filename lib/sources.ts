// This file is the control panel for the whole site.
// Add, remove or swap feed URLs here — nothing else needs to change.
//
// IMPORTANT: RSS feed URLs on Indian news sites change without notice.
// Before you rely on this, run `node scripts/check-feeds.mjs` from the
// project root — it pings every feed below and tells you which ones
// are alive. Replace any that fail. A good replacement is usually
// "<site name> rss feed <category>" in a search engine.

export type Category = {
  slug: string;
  label: string;
  // Tailwind color used for this category's tag/accent
  color: "wire" | "teal" | "mustard" | "ink" | "rose" | "navy";
  feeds: string[];
};

export const categories: Category[] = [
  {
    slug: "top",
    label: "Top Stories",
    color: "wire",
    feeds: [
      "https://timesofindia.indiatimes.com/rssfeedstopstories.cms",
      "https://feeds.feedburner.com/ndtvnews-top-stories",
      "https://www.hindustantimes.com/feeds/rss/india-news/rssfeed.xml"
    ]
  },
  {
    slug: "entertainment",
    label: "Entertainment",
    color: "mustard",
    feeds: [
      "https://timesofindia.indiatimes.com/rssfeeds/1081479906.cms",
      "https://www.bollywoodhungama.com/rss/news.xml"
    ]
  },
  {
    slug: "bollywood",
    label: "Bollywood",
    color: "rose",
    // Single-sourced on purpose: Hungama alone has good image coverage and
    // is genuinely Bollywood-specific. TOI's entertainment feed was tried
    // as a second source, but it's the exact same feed already used by
    // "Entertainment" above, which made the two categories show near-
    // identical content. Pinkvilla was tried too, but almost none of its
    // items carry an image (1/50 in testing) — not worth the tradeoff.
    feeds: [
      "https://www.bollywoodhungama.com/rss/news.xml"
    ]
  },
  {
    slug: "hollywood",
    label: "Hollywood",
    color: "teal",
    feeds: [
      "https://deadline.com/feed/",
      "https://variety.com/feed/"
    ]
  },
  {
    slug: "crime",
    label: "Crime",
    color: "ink",
    // IndiaTV runs a dedicated crime-beat feed; NDTV's general India feed
    // is mixed in too since it regularly carries crime stories and (unlike
    // the IndiaTV feed) includes images.
    feeds: [
      "https://www.indiatvnews.com/rssnews/topstory-crime.xml",
      "https://feeds.feedburner.com/ndtvnews-india-news"
    ]
  },
  {
    slug: "politics",
    label: "Politics",
    color: "navy",
    // rss/home is India Today's general homepage feed (cricket, gadgets,
    // everything) — it was never politics-specific and was leaking
    // off-topic stories into this category. IndiaTV has a real dedicated
    // politics feed but almost no images (1 across the whole feed, same
    // problem as Pinkvilla for Bollywood), so this stays single-sourced
    // on India Today's Nation feed, which is both on-topic and image-rich.
    feeds: [
      "https://www.indiatoday.in/rss/1206514"
    ]
  }
];

export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}
