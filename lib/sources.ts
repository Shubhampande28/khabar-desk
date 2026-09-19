// This file is the control panel for the whole site.
// Add, remove or swap feed URLs here — nothing else needs to change.
//
// IMPORTANT: RSS feed URLs on Indian news sites change without notice.
// Before you rely on this, run `npm run check-feeds` from the project
// root — it pings every feed below and tells you which ones are alive.
// Replace any that fail. A good replacement is usually
// "<site name> rss feed <category>" in a search engine.

export type Category = {
  slug: string;
  label: string;
  // Tailwind color used for this category's tag/accent
  color:
    | "accent"
    | "entertainment"
    | "bollywood"
    | "hollywood"
    | "crime"
    | "politics"
    | "business"
    | "markets"
    | "startups";
  feeds: string[];
};

export const categories: Category[] = [
  {
    slug: "top",
    label: "Top Stories",
    color: "accent",
    feeds: [
      "https://timesofindia.indiatimes.com/rssfeedstopstories.cms",
      "https://feeds.feedburner.com/ndtvnews-top-stories",
      "https://www.hindustantimes.com/feeds/rss/india-news/rssfeed.xml"
    ]
  },
  {
    slug: "entertainment",
    label: "Entertainment",
    color: "entertainment",
    // Bollywood Hungama used to be a second feed here, but it's Bollywood's
    // only feed too — every article from it was being ingested under BOTH
    // categories, so Entertainment and Bollywood showed identical content.
    // Fixed at the query layer (see CATEGORY_CHILDREN below + the
    // exclusion filter in lib/db.ts): Entertainment's query now excludes
    // anything already claimed by Bollywood/Hollywood, so dropping the
    // shared feed here too just avoids redundant ingestion work.
    feeds: ["https://timesofindia.indiatimes.com/rssfeeds/1081479906.cms"]
  },
  {
    slug: "bollywood",
    label: "Bollywood",
    color: "bollywood",
    feeds: ["https://www.bollywoodhungama.com/rss/news.xml"]
  },
  {
    slug: "hollywood",
    label: "Hollywood",
    color: "hollywood",
    feeds: ["https://deadline.com/feed/", "https://variety.com/feed/"]
  },
  {
    slug: "crime",
    label: "Crime",
    color: "crime",
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
    color: "politics",
    // rss/home is India Today's general homepage feed (cricket, gadgets,
    // everything) — it was never politics-specific and was leaking
    // off-topic stories into this category. IndiaTV has a real dedicated
    // politics feed but almost no images (1 across the whole feed, same
    // problem as Pinkvilla for Bollywood), so this stays single-sourced
    // on India Today's Nation feed, which is both on-topic and image-rich.
    feeds: ["https://www.indiatoday.in/rss/1206514"]
  },
  {
    slug: "business",
    label: "Business",
    color: "business",
    // Economic Times' general "industry" feed — genuinely business/industry
    // news (confirmed: company earnings, market policy, GST/pricing
    // stories, not general national news) and every item has an image.
    feeds: ["https://economictimes.indiatimes.com/industry/rssfeeds/13352306.cms"]
  },
  {
    slug: "markets",
    label: "Markets",
    color: "markets",
    // Both confirmed genuinely market-specific (stocks, IPOs, indices,
    // commodities) with full image coverage, not just relabeled Business
    // content — see CATEGORY_CHILDREN below for how overlap with Business
    // is prevented at the query layer.
    feeds: [
      "https://economictimes.indiatimes.com/markets/rssfeeds/1977021501.cms",
      "https://www.livemint.com/rss/markets"
    ]
  },
  {
    slug: "startups",
    label: "Startups",
    color: "startups",
    feeds: ["https://inc42.com/feed/"]
  }
];

// Parent categories query articles NOT already claimed by their children
// (see the exclusion filter in lib/db.ts) — this is what stops the same
// article showing in both a parent's rail and a more specific child's
// rail when their feed lists happen to overlap, or when they cover
// genuinely overlapping ground (e.g. Business vs Markets).
export const CATEGORY_CHILDREN: Record<string, string[]> = {
  entertainment: ["bollywood", "hollywood"],
  business: ["markets", "startups"]
};

export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}
