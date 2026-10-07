import { categories, CATEGORY_CHILDREN } from "@/lib/sources";
import { getArticlesForSitemap } from "@/lib/db";
import { encodeStorySlug } from "@/lib/story";
import { SITE_URL, SITE_NAME } from "@/lib/site";

// Google News wants only very recent articles, in a separate sitemap using
// the news: namespace — see https://developers.google.com/search/docs/crawling-indexing/sitemaps/news-sitemap.
// This is the sitemap format only; actual inclusion in Google News also
// requires the site to be accepted into Google News (Publisher Center),
// which is a separate, manual step.
export const dynamic = "force-dynamic";

const HOURS_48_IN_DAYS = 2;

function escapeXml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export async function GET() {
  const cutoff = Date.now() - 48 * 60 * 60 * 1000;
  const entries: string[] = [];

  for (const category of categories) {
    const articles = getArticlesForSitemap(
      category.slug,
      HOURS_48_IN_DAYS,
      300,
      CATEGORY_CHILDREN[category.slug] ?? []
    );
    for (const article of articles) {
      if (!article.isoDate || new Date(article.isoDate).getTime() < cutoff) continue;

      const slug =
        article.slug ||
        encodeStorySlug(article, {
          slug: category.slug,
          label: category.label,
          color: category.color
        });
      const loc = escapeXml(`${SITE_URL}/story/${slug}`);
      const title = escapeXml(article.title);

      entries.push(
        `<url><loc>${loc}</loc>` +
          `<news:news><news:publication><news:name>${escapeXml(
            SITE_NAME
          )}</news:name><news:language>en</news:language></news:publication>` +
          `<news:publication_date>${article.isoDate}</news:publication_date>` +
          `<news:title>${title}</news:title></news:news></url>`
      );
    }
  }

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" ` +
    `xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">\n` +
    `${entries.join("\n")}\n</urlset>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml" }
  });
}
