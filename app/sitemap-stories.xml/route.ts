import { categories } from "@/lib/sources";
import { getArticlesForSitemap } from "@/lib/db";
import { encodeStorySlug } from "@/lib/story";
import { SITE_URL } from "@/lib/site";

// Separate from the main sitemap.xml (which only lists the static/category
// pages) because story URLs are generated from the article database, not
// known at build time. Listing them here gives Google a direct path to
// each story page instead of relying purely on it crawling category pages
// and following links.
export const dynamic = "force-dynamic";

function escapeXml(value: string): string {
  return value.replace(/&/g, "&amp;");
}

export async function GET() {
  const urls: string[] = [];

  for (const category of categories) {
    const articles = getArticlesForSitemap(category.slug);
    for (const article of articles) {
      const slug = encodeStorySlug(article, {
        slug: category.slug,
        label: category.label,
        color: category.color
      });
      const loc = escapeXml(`${SITE_URL}/story/${slug}`);
      const lastmod = article.isoDate ?? new Date().toISOString();
      urls.push(`<url><loc>${loc}</loc><lastmod>${lastmod}</lastmod></url>`);
    }
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join(
    "\n"
  )}\n</urlset>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml" }
  });
}
