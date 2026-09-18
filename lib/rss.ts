import Parser from "rss-parser";
import { Article } from "./types";

const parser = new Parser({
  customFields: {
    item: [
      ["media:content", "mediaContent"],
      ["media:thumbnail", "mediaThumbnail"],
      ["enclosure", "enclosure"]
    ]
  }
});

// Friendly names for known hosts. Anything not listed here falls back to
// the bare hostname, so new feeds work without editing this file.
const SOURCE_NAMES: Record<string, string> = {
  "timesofindia.indiatimes.com": "Times of India",
  "feeds.feedburner.com": "NDTV",
  "www.hindustantimes.com": "Hindustan Times",
  "www.bollywoodhungama.com": "Bollywood Hungama",
  "deadline.com": "Deadline",
  "variety.com": "Variety",
  "www.indiatoday.in": "India Today",
  "www.indiatvnews.com": "India TV"
};

function sourceNameFromUrl(url: string): string {
  try {
    const host = new URL(url).hostname;
    return SOURCE_NAMES[host] ?? host.replace(/^www\./, "");
  } catch {
    return "Unknown source";
  }
}

function extractImage(item: any): string | null {
  if (item.mediaContent?.$?.url) return item.mediaContent.$.url;
  if (item.mediaThumbnail?.$?.url) return item.mediaThumbnail.$.url;
  if (item.enclosure?.url) return item.enclosure.url;
  const html: string | undefined = item["content:encoded"] || item.content;
  if (html) {
    // Some publishers (e.g. Pinkvilla) lazy-load images with data-src
    // instead of src, so try that as a fallback.
    const match =
      html.match(/<img[^>]+src="([^">]+)"/i) ||
      html.match(/<img[^>]+data-src="([^">]+)"/i);
    if (match) return match[1];
  }
  return null;
}

// Revalidate every 15 minutes so the site stays fresh without hammering
// the source sites on every single page load.
const REVALIDATE_SECONDS = 900;

async function fetchOneFeed(url: string): Promise<Article[]> {
  const res = await fetch(url, {
    next: { revalidate: REVALIDATE_SECONDS },
    headers: {
      // Some publishers block requests with no user agent at all.
      "User-Agent": "Mozilla/5.0 (compatible; NewsDeskBot/1.0)"
    }
  });
  if (!res.ok) {
    throw new Error(`${url} responded with ${res.status}`);
  }
  const xml = await res.text();
  const feed = await parser.parseString(xml);
  const sourceName = sourceNameFromUrl(url);

  return (feed.items || []).map((item) => ({
    title: item.title?.trim() || "Untitled",
    link: item.link?.trim() || "#",
    source: sourceName,
    isoDate: item.isoDate || null,
    contentSnippet: item.contentSnippet?.trim().slice(0, 180) || null,
    image: extractImage(item)
  }));
}

export type FeedResult = {
  articles: Article[];
  failedFeeds: string[];
};

// Fetches every feed, dedupes by link, sorts by date — no capping/limit
// applied. Used by the ingestion job, which wants everything it can get so
// the archive accumulates real history; display-time selection (capping,
// trimming to a page size) happens separately in lib/db.ts.
export async function fetchAllArticles(feedUrls: string[]): Promise<FeedResult> {
  const settled = await Promise.allSettled(feedUrls.map(fetchOneFeed));

  const articles: Article[] = [];
  const failedFeeds: string[] = [];

  settled.forEach((result, i) => {
    if (result.status === "fulfilled") {
      articles.push(...result.value);
    } else {
      failedFeeds.push(feedUrls[i]);
    }
  });

  const seen = new Set<string>();
  const deduped = articles.filter((a) => {
    if (seen.has(a.link)) return false;
    seen.add(a.link);
    return true;
  });

  deduped.sort(byDateDesc);

  return { articles: deduped, failedFeeds };
}

export async function getArticlesForFeeds(
  feedUrls: string[],
  limit = 30
): Promise<FeedResult> {
  const { articles, failedFeeds } = await fetchAllArticles(feedUrls);
  const diversified = capBySource(articles, limit);
  return { articles: diversified.slice(0, limit), failedFeeds };
}

export function dateOf(a: Article): number {
  return a.isoDate ? new Date(a.isoDate).getTime() : 0;
}

export function byDateDesc(a: Article, b: Article): number {
  return dateOf(b) - dateOf(a);
}

// A pure "sort by date" merge lets whichever source publishes most
// frequently crowd out every other feed entirely — if two fast sources
// each have `limit`-worth of articles newer than anything a slower third
// source has published, a simple per-source cap still lets those two fill
// every slot before the third is ever considered. So instead: give every
// source a guaranteed minimum share of the slots first (its freshest
// articles up to that share), then fill whatever's left, most-recent
// first, capped at ~1.5x fair share so no source runs away with it.
export function capBySource(sorted: Article[], limit: number): Article[] {
  const sources = Array.from(new Set(sorted.map((a) => a.source)));
  if (sources.length <= 1) return sorted;

  const bySource = new Map<string, Article[]>();
  for (const source of sources) bySource.set(source, []);
  for (const article of sorted) bySource.get(article.source)!.push(article);

  const minShare = Math.floor(limit / sources.length);
  const maxShare = Math.max(minShare, Math.ceil((limit / sources.length) * 1.5));

  const result: Article[] = [];
  const leftoverPool: Article[] = [];

  for (const source of sources) {
    const articles = bySource.get(source)!;
    result.push(...articles.slice(0, minShare));
    leftoverPool.push(...articles.slice(minShare, maxShare));
  }

  leftoverPool.sort(byDateDesc);
  const stillNeeded = limit - result.length;
  result.push(...leftoverPool.slice(0, Math.max(0, stillNeeded)));

  result.sort(byDateDesc);
  return result;
}
