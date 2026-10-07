import Database from "better-sqlite3";
import fs from "fs";
import path from "path";
import { Article } from "./types";
import { capBySource } from "./rss";
import { getCategory } from "./sources";
import { encodeStorySlug } from "./story";
import { cleanTitle, cleanDescription } from "./textClean";

const DB_DIR = process.env.DB_DIR || path.join(process.cwd(), "data");
const DB_PATH = path.join(DB_DIR, "articles.db");

fs.mkdirSync(DB_DIR, { recursive: true });

const db = new Database(DB_PATH);
db.pragma("journal_mode = WAL");

db.exec(`
  CREATE TABLE IF NOT EXISTS articles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    link TEXT NOT NULL,
    category_slug TEXT NOT NULL,
    title TEXT NOT NULL,
    source TEXT NOT NULL,
    iso_date TEXT,
    image TEXT,
    content_snippet TEXT,
    first_seen_at TEXT NOT NULL,
    UNIQUE(link, category_slug)
  );
  CREATE INDEX IF NOT EXISTS idx_articles_category_date
    ON articles(category_slug, iso_date DESC);
  CREATE INDEX IF NOT EXISTS idx_articles_link ON articles(link);
`);

// Added after the initial schema — older deployed DBs won't have this
// column yet, so add it if missing rather than assuming a fresh table.
const existingColumns = new Set(
  (db.prepare("PRAGMA table_info(articles)").all() as { name: string }[]).map(
    (col) => col.name
  )
);
function addColumnIfMissing(name: string, ddl: string) {
  if (existingColumns.has(name)) return;
  try {
    db.exec(`ALTER TABLE articles ADD COLUMN ${ddl}`);
  } catch (err) {
    // Next's build-time page-data collection loads this module from
    // several route bundles concurrently, each with its own in-process
    // connection to the same file — two can both see the column missing
    // and race to add it. Harmless as long as it's genuinely this error.
    const message = err instanceof Error ? err.message : String(err);
    if (!message.includes("duplicate column name")) throw err;
  }
  existingColumns.add(name);
}
addColumnIfMissing("slug", "slug TEXT");

// Milestone 3: original editorial value layered on top of the aggregated
// link. our_summary/why_it_matters/editor_name/reviewed_at are only ever
// shown publicly once reviewed_at is set — see getArticleEditorial and the
// story page's noindex handling for unreviewed rows.
addColumnIfMissing("our_summary", "our_summary TEXT");
addColumnIfMissing("why_it_matters", "why_it_matters TEXT");
addColumnIfMissing("editor_name", "editor_name TEXT");
addColumnIfMissing("reviewed_at", "reviewed_at TEXT");
addColumnIfMissing("is_featured", "is_featured INTEGER NOT NULL DEFAULT 0");
addColumnIfMissing("content_warning", "content_warning INTEGER NOT NULL DEFAULT 0");

// A story's /story/[slug] URL embeds the article's data directly (see
// lib/story.ts) so it keeps resolving even after the row disappears from
// the feed window. But re-ingesting the same article can update its title/
// image/excerpt in place (publishers edit headlines after posting) — if the
// slug were regenerated from that live data on every render, the same
// story's URL would drift every time its row changed. So the slug is
// generated once, the first time a (link, category) pair is inserted, and
// frozen from then on: ON CONFLICT never overwrites an existing slug, only
// backfills one for rows that predate this column (COALESCE keeps update
// time slug's whatever frozen value is already there if one exists).
const insertStmt = db.prepare(`
  INSERT INTO articles
    (link, category_slug, title, source, iso_date, image, content_snippet, first_seen_at, slug)
  VALUES
    (@link, @categorySlug, @title, @source, @isoDate, @image, @contentSnippet, @firstSeenAt, @slug)
  ON CONFLICT(link, category_slug) DO UPDATE SET
    title = excluded.title,
    source = excluded.source,
    iso_date = excluded.iso_date,
    image = excluded.image,
    content_snippet = excluded.content_snippet,
    slug = COALESCE(articles.slug, excluded.slug)
`);

export function upsertArticles(categorySlug: string, articles: Article[]): void {
  const now = new Date().toISOString();
  const category = getCategory(categorySlug);
  const insertMany = db.transaction((items: Article[]) => {
    for (const a of items) {
      insertStmt.run({
        link: a.link,
        categorySlug,
        title: a.title,
        source: a.source,
        isoDate: a.isoDate,
        image: a.image,
        contentSnippet: a.contentSnippet,
        firstSeenAt: now,
        slug: category ? encodeStorySlug(a, category) : null
      });
    }
  });
  insertMany(articles);
}

type ArticleRow = {
  link: string;
  title: string;
  source: string;
  iso_date: string | null;
  image: string | null;
  content_snippet: string | null;
  slug: string | null;
};

function rowToArticle(row: ArticleRow): Article {
  return {
    link: row.link,
    title: row.title,
    source: row.source,
    isoDate: row.iso_date,
    image: row.image,
    contentSnippet: row.content_snippet,
    slug: row.slug
  };
}

// A parent category (e.g. "entertainment") excludes any article link
// already claimed by one of its child categories (e.g. "bollywood",
// "hollywood") — this is what stops the same article rendering in two
// rails on the homepage. Self-healing: it filters at read time against
// whatever's currently in the DB, so it works even on rows ingested
// before this existed, with no migration needed.
function exclusionClause(excludeCategorySlugs: string[]): {
  sql: string;
  params: string[];
} {
  if (excludeCategorySlugs.length === 0) return { sql: "", params: [] };
  const placeholders = excludeCategorySlugs.map(() => "?").join(", ");
  return {
    sql: `AND link NOT IN (SELECT link FROM articles WHERE category_slug IN (${placeholders}))`,
    params: excludeCategorySlugs
  };
}

// Pulls a generous recent window so the diversity-capping logic (same one
// the old live-fetch path used) has enough supply per source to work with,
// then trims to `limit` for display. `featuredFirst` sorts reviewed/
// featured stories to the front of that window before the date sort and
// diversity capping run — used by the homepage per Milestone 3; category
// rails stay plain-chronological.
export function getRecentArticles(
  categorySlug: string,
  limit: number,
  excludeCategorySlugs: string[] = [],
  featuredFirst = false
): Article[] {
  const { sql: excludeSql, params: excludeParams } = exclusionClause(excludeCategorySlugs);
  const rows = db
    .prepare(
      `SELECT link, title, source, iso_date, image, content_snippet, slug, is_featured
       FROM articles
       WHERE category_slug = ? ${excludeSql}
       ORDER BY iso_date DESC
       LIMIT ?`
    )
    .all(categorySlug, ...excludeParams, Math.max(limit * 6, 60)) as (ArticleRow & {
    is_featured: number;
  })[];

  const articles = rows.map((row) => ({
    ...rowToArticle(row),
    isFeatured: row.is_featured === 1
  }));

  if (!featuredFirst) {
    return capBySource(articles, limit).slice(0, limit);
  }

  // capBySource always ends by re-sorting strictly by date and cuts to
  // `limit` before any featured-precedence could be applied — fatal for a
  // single-feed category (capBySource is a no-op there), where an older
  // featured story would get sliced out of the date-only window before it
  // ever had a chance to be promoted. So featured and non-featured are
  // capped as separate pools and concatenated, guaranteeing featured
  // articles (already date-sorted from the query) occupy the front slots.
  const featured = articles.filter((a) => a.isFeatured).slice(0, limit);
  const remainingSlots = limit - featured.length;
  const rest =
    remainingSlots > 0
      ? capBySource(
          articles.filter((a) => !a.isFeatured),
          remainingSlots
        ).slice(0, remainingSlots)
      : [];
  return [...featured, ...rest];
}

// For the dynamic story sitemap: recent articles, per category, so each
// comes back with the category info needed to build its story URL. Capped
// to a window (not the whole archive) since a sitemap should represent
// what's actually worth crawling regularly, not permanent history —
// older stories stay reachable via the archive pages instead.
export function getArticlesForSitemap(
  categorySlug: string,
  sinceDays = 7,
  limit = 300,
  excludeCategorySlugs: string[] = []
): Article[] {
  const sinceIso = new Date(Date.now() - sinceDays * 24 * 60 * 60 * 1000).toISOString();
  const { sql: excludeSql, params: excludeParams } = exclusionClause(excludeCategorySlugs);
  const rows = db
    .prepare(
      `SELECT link, title, source, iso_date, image, content_snippet, slug
       FROM articles
       WHERE category_slug = ? AND iso_date >= ? ${excludeSql}
       ORDER BY iso_date DESC
       LIMIT ?`
    )
    .all(categorySlug, sinceIso, ...excludeParams, limit) as ArticleRow[];
  return rows.map(rowToArticle);
}

// One-off cleanup for rows ingested before HTML-entity/markup cleaning
// existed at ingest time (see lib/textClean.ts and scripts/clean-text.ts).
// Only touches the display columns — never the frozen `slug`, which embeds
// whatever text was true when that article's URL was first issued and must
// stay byte-for-byte stable (see the slug-freezing comment on insertStmt).
export function cleanStoredArticleText(): { scanned: number; updated: number } {
  const rows = db.prepare("SELECT id, title, content_snippet FROM articles").all() as {
    id: number;
    title: string;
    content_snippet: string | null;
  }[];

  const update = db.prepare(
    "UPDATE articles SET title = @title, content_snippet = @contentSnippet WHERE id = @id"
  );

  let updated = 0;
  const run = db.transaction(() => {
    for (const row of rows) {
      const title = cleanTitle(row.title) || row.title;
      const contentSnippet = cleanDescription(row.content_snippet, 300);
      if (title !== row.title || contentSnippet !== row.content_snippet) {
        update.run({ id: row.id, title, contentSnippet });
        updated++;
      }
    }
  });
  run();

  return { scanned: rows.length, updated };
}

export type SearchResult = Article & { categorySlug: string };

// Simple title search across every category — backs the search box on the
// 404 page. LIKE on an un-indexed column is fine at this table's size; add
// an index or FTS5 if the archive grows large enough for it to matter.
export function searchArticles(query: string, limit = 20): SearchResult[] {
  const trimmed = query.trim();
  if (!trimmed) return [];
  const rows = db
    .prepare(
      `SELECT link, title, source, iso_date, image, content_snippet, slug, category_slug
       FROM articles
       WHERE title LIKE ?
       ORDER BY iso_date DESC
       LIMIT ?`
    )
    .all(`%${trimmed}%`, limit) as (ArticleRow & { category_slug: string })[];

  const seen = new Set<string>();
  const results: SearchResult[] = [];
  for (const row of rows) {
    if (seen.has(row.link)) continue;
    seen.add(row.link);
    results.push({ ...rowToArticle(row), categorySlug: row.category_slug });
  }
  return results;
}

export type ArticleEditorial = {
  ourSummary: string | null;
  whyItMatters: string | null;
  editorName: string | null;
  reviewedAt: string | null;
  isFeatured: boolean;
  contentWarning: boolean;
};

// The story page is otherwise fully self-contained (see lib/story.ts) —
// this is the one place it touches the DB, to pick up editorial review
// state layered on afterward. Keyed by (link, category_slug) since that's
// the row's real identity; the slug itself can't be used as a key because
// it's a frozen snapshot, not a pointer.
export function getArticleEditorial(
  link: string,
  categorySlug: string
): ArticleEditorial | null {
  const row = db
    .prepare(
      `SELECT our_summary, why_it_matters, editor_name, reviewed_at, is_featured, content_warning
       FROM articles WHERE link = ? AND category_slug = ?`
    )
    .get(link, categorySlug) as
    | {
        our_summary: string | null;
        why_it_matters: string | null;
        editor_name: string | null;
        reviewed_at: string | null;
        is_featured: number;
        content_warning: number;
      }
    | undefined;
  if (!row) return null;
  return {
    ourSummary: row.our_summary,
    whyItMatters: row.why_it_matters,
    editorName: row.editor_name,
    reviewedAt: row.reviewed_at,
    isFeatured: row.is_featured === 1,
    contentWarning: row.content_warning === 1
  };
}

export type AdminArticleRow = {
  id: number;
  link: string;
  title: string;
  source: string;
  categorySlug: string;
  isoDate: string | null;
  contentSnippet: string | null;
} & ArticleEditorial;

// Backs /admin: today's ingested stories (by first_seen_at, so re-ingested
// older stories that merely got their title/image refreshed don't count),
// optionally filtered to one category.
export function getTodayArticlesForReview(categorySlug?: string): AdminArticleRow[] {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const categoryClause = categorySlug ? "AND category_slug = ?" : "";
  const params = categorySlug
    ? [todayStart.toISOString(), categorySlug]
    : [todayStart.toISOString()];

  const rows = db
    .prepare(
      `SELECT id, link, title, source, category_slug, iso_date, content_snippet,
              our_summary, why_it_matters, editor_name, reviewed_at, is_featured, content_warning
       FROM articles
       WHERE first_seen_at >= ? ${categoryClause}
       ORDER BY iso_date DESC`
    )
    .all(...params) as {
    id: number;
    link: string;
    title: string;
    source: string;
    category_slug: string;
    iso_date: string | null;
    content_snippet: string | null;
    our_summary: string | null;
    why_it_matters: string | null;
    editor_name: string | null;
    reviewed_at: string | null;
    is_featured: number;
    content_warning: number;
  }[];

  return rows.map((row) => ({
    id: row.id,
    link: row.link,
    title: row.title,
    source: row.source,
    categorySlug: row.category_slug,
    isoDate: row.iso_date,
    contentSnippet: row.content_snippet,
    ourSummary: row.our_summary,
    whyItMatters: row.why_it_matters,
    editorName: row.editor_name,
    reviewedAt: row.reviewed_at,
    isFeatured: row.is_featured === 1,
    contentWarning: row.content_warning === 1
  }));
}

// Saving a draft (reviewed = false) keeps it private — only a reviewed
// save (the editor ticking "I reviewed this") sets reviewed_at/editor_name
// and makes our_summary/why_it_matters eligible to show publicly; see
// getArticleEditorial's callers for the reviewed_at gate.
export function saveArticleEditorial(params: {
  id: number;
  ourSummary: string;
  whyItMatters: string;
  isFeatured: boolean;
  contentWarning: boolean;
  reviewed: boolean;
  editorName: string;
}): void {
  db.prepare(
    `UPDATE articles SET
       our_summary = @ourSummary,
       why_it_matters = @whyItMatters,
       is_featured = @isFeatured,
       content_warning = @contentWarning,
       reviewed_at = CASE WHEN @reviewed = 1 THEN @now ELSE reviewed_at END,
       editor_name = CASE WHEN @reviewed = 1 THEN @editorName ELSE editor_name END
     WHERE id = @id`
  ).run({
    id: params.id,
    ourSummary: params.ourSummary,
    whyItMatters: params.whyItMatters,
    isFeatured: params.isFeatured ? 1 : 0,
    contentWarning: params.contentWarning ? 1 : 0,
    reviewed: params.reviewed ? 1 : 0,
    editorName: params.editorName,
    now: new Date().toISOString()
  });
}

export function getArchivePage(
  categorySlug: string,
  page: number,
  pageSize = 24,
  excludeCategorySlugs: string[] = []
): { articles: Article[]; total: number; totalPages: number } {
  const offset = (page - 1) * pageSize;
  const { sql: excludeSql, params: excludeParams } = exclusionClause(excludeCategorySlugs);

  const rows = db
    .prepare(
      `SELECT link, title, source, iso_date, image, content_snippet, slug
       FROM articles
       WHERE category_slug = ? ${excludeSql}
       ORDER BY iso_date DESC
       LIMIT ? OFFSET ?`
    )
    .all(categorySlug, ...excludeParams, pageSize, offset) as ArticleRow[];

  const { count } = db
    .prepare(
      `SELECT COUNT(*) as count FROM articles WHERE category_slug = ? ${excludeSql}`
    )
    .get(categorySlug, ...excludeParams) as { count: number };

  return {
    articles: rows.map(rowToArticle),
    total: count,
    totalPages: Math.max(1, Math.ceil(count / pageSize))
  };
}
