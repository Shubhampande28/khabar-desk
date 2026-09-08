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
    const match = html.match(/<img[^>]+src="([^">]+)"/i);
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
    link: item.link || "#",
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

export async function getArticlesForFeeds(
  feedUrls: string[],
  limit = 30
): Promise<FeedResult> {
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

  deduped.sort((a, b) => {
    const dateA = a.isoDate ? new Date(a.isoDate).getTime() : 0;
    const dateB = b.isoDate ? new Date(b.isoDate).getTime() : 0;
    return dateB - dateA;
  });

  return { articles: deduped.slice(0, limit), failedFeeds };
}
