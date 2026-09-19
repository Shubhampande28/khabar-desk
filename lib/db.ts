import Database from "better-sqlite3";
import fs from "fs";
import path from "path";
import { Article } from "./types";
import { capBySource } from "./rss";

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
`);

const insertStmt = db.prepare(`
  INSERT INTO articles
    (link, category_slug, title, source, iso_date, image, content_snippet, first_seen_at)
  VALUES
    (@link, @categorySlug, @title, @source, @isoDate, @image, @contentSnippet, @firstSeenAt)
  ON CONFLICT(link, category_slug) DO UPDATE SET
    title = excluded.title,
    source = excluded.source,
    iso_date = excluded.iso_date,
    image = excluded.image,
    content_snippet = excluded.content_snippet
`);

export function upsertArticles(categorySlug: string, articles: Article[]): void {
  const now = new Date().toISOString();
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
        firstSeenAt: now
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
};

function rowToArticle(row: ArticleRow): Article {
  return {
    link: row.link,
    title: row.title,
    source: row.source,
    isoDate: row.iso_date,
    image: row.image,
    contentSnippet: row.content_snippet
  };
}

// Pulls a generous recent window so the diversity-capping logic (same one
// the old live-fetch path used) has enough supply per source to work with,
// then trims to `limit` for display.
export function getRecentArticles(categorySlug: string, limit: number): Article[] {
  const rows = db
    .prepare(
      `SELECT link, title, source, iso_date, image, content_snippet
       FROM articles
       WHERE category_slug = ?
       ORDER BY iso_date DESC
       LIMIT ?`
    )
    .all(categorySlug, Math.max(limit * 6, 60)) as ArticleRow[];

  const articles = rows.map(rowToArticle);
  return capBySource(articles, limit).slice(0, limit);
}

// For the dynamic story sitemap: recent articles, per category, so each
// comes back with the category info needed to build its story URL. Capped
// to a window (not the whole archive) since a sitemap should represent
// what's actually worth crawling regularly, not permanent history —
// older stories stay reachable via the archive pages instead.
export function getArticlesForSitemap(
  categorySlug: string,
  sinceDays = 7,
  limit = 300
): Article[] {
  const sinceIso = new Date(Date.now() - sinceDays * 24 * 60 * 60 * 1000).toISOString();
  const rows = db
    .prepare(
      `SELECT link, title, source, iso_date, image, content_snippet
       FROM articles
       WHERE category_slug = ? AND iso_date >= ?
       ORDER BY iso_date DESC
       LIMIT ?`
    )
    .all(categorySlug, sinceIso, limit) as ArticleRow[];
  return rows.map(rowToArticle);
}

export function getArchivePage(
  categorySlug: string,
  page: number,
  pageSize = 24
): { articles: Article[]; total: number; totalPages: number } {
  const offset = (page - 1) * pageSize;

  const rows = db
    .prepare(
      `SELECT link, title, source, iso_date, image, content_snippet
       FROM articles
       WHERE category_slug = ?
       ORDER BY iso_date DESC
       LIMIT ? OFFSET ?`
    )
    .all(categorySlug, pageSize, offset) as ArticleRow[];

  const { count } = db
    .prepare(`SELECT COUNT(*) as count FROM articles WHERE category_slug = ?`)
    .get(categorySlug) as { count: number };

  return {
    articles: rows.map(rowToArticle),
    total: count,
    totalPages: Math.max(1, Math.ceil(count / pageSize))
  };
}
