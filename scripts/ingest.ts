// Run every 15 minutes by a systemd timer on the server (see deploy notes).
// Fetches every category's feeds and upserts new/updated articles into
// SQLite. This is the only place that talks to the live RSS feeds — pages
// read from the database, not from a live fetch, so a page render never
// depends on a source feed being up at that exact moment.

import { categories } from "../lib/sources";
import { fetchAllArticles } from "../lib/rss";
import { upsertArticles } from "../lib/db";

async function main() {
  let totalUpserted = 0;

  for (const category of categories) {
    const { articles, failedFeeds } = await fetchAllArticles(category.feeds);
    upsertArticles(category.slug, articles);
    totalUpserted += articles.length;

    console.log(
      `[${category.slug}] upserted ${articles.length} articles` +
        (failedFeeds.length > 0 ? ` (${failedFeeds.length} feed(s) failed)` : "")
    );
  }

  console.log(`Done. ${totalUpserted} articles processed across ${categories.length} categories.`);
}

main().catch((err) => {
  console.error("Ingestion failed:", err);
  process.exit(1);
});
