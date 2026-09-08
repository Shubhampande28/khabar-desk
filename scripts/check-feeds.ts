// Run with: npm run check-feeds
// Pings every feed URL in lib/sources.ts and reports which ones work,
// so you can fix or replace dead links before relying on them.

import { categories } from "../lib/sources";

async function check(url: string) {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; NewsDeskBot/1.0)" }
    });
    const text = await res.text();
    const looksLikeFeed = text.includes("<rss") || text.includes("<feed");
    if (res.ok && looksLikeFeed) return { ok: true, reason: "" };
    return { ok: false, reason: `HTTP ${res.status}, or not an RSS/Atom feed` };
  } catch (err) {
    return { ok: false, reason: (err as Error).message };
  }
}

async function main() {
  const results = [];
  for (const category of categories) {
    for (const url of category.feeds) {
      const result = await check(url);
      results.push({ category: category.label, url, ...result });
    }
  }

  console.log("\nFeed check results:\n");
  for (const r of results) {
    const status = r.ok ? "OK  " : "FAIL";
    console.log(`[${status}] ${r.category.padEnd(14)} ${r.url}`);
    if (!r.ok) console.log(`        -> ${r.reason}`);
  }

  const failed = results.filter((r) => !r.ok).length;
  console.log(`\n${results.length - failed}/${results.length} feeds are working.`);
  if (failed > 0) {
    console.log("Fix the failing ones in lib/sources.ts before you rely on this.");
  }
}

main();
