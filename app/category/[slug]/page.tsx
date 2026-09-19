import { notFound } from "next/navigation";
import Link from "next/link";
import { getCategory } from "@/lib/sources";
import { getRecentArticles } from "@/lib/db";
import { RowCard } from "@/components/NewsCard";
import AdSlot from "@/components/AdSlot";
import { accentBg, accentText } from "@/lib/colors";

// Data comes from a local SQLite database that a background ingestion job
// keeps updated (see scripts/ingest.ts) — always render fresh from it
// rather than caching a build-time snapshot.
export const dynamic = "force-dynamic";

export function generateMetadata({ params }: { params: { slug: string } }) {
  const category = getCategory(params.slug);
  if (!category) return { title: "Not found" };
  return {
    title: category.label,
    description: `Latest ${category.label} news, updated throughout the day.`
  };
}

export default function CategoryPage({
  params
}: {
  params: { slug: string };
}) {
  const category = getCategory(params.slug);
  if (!category) notFound();

  const articles = getRecentArticles(category.slug, 30);

  return (
    <section className="py-10">
      <div className="mb-6 flex items-center gap-2">
        <span className={`h-1.5 w-1.5 rounded-full ${accentBg(category.color)}`} />
        <span className={`text-xs font-bold uppercase tracking-wide ${accentText(category.color)}`}>
          {category.label}
        </span>
      </div>

      {articles.length === 0 ? (
        <p className="text-sm text-inkSoft">
          Nothing's been ingested for {category.label} yet. Run{" "}
          <code>npm run ingest</code> to fetch the feeds, or check
          lib/sources.ts.
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {articles.slice(0, 12).map((article) => (
              <RowCard
                key={article.link}
                article={article}
                accent={category.color}
                category={{ slug: category.slug, label: category.label }}
              />
            ))}
          </div>

          {articles.length > 12 && <AdSlot />}

          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {articles.slice(12).map((article) => (
              <RowCard
                key={article.link}
                article={article}
                accent={category.color}
                category={{ slug: category.slug, label: category.label }}
              />
            ))}
          </div>

          <div className="mt-10 border-t border-line pt-6">
            <Link
              href={`/category/${category.slug}/archive`}
              className="text-sm font-medium text-inkSoft transition-colors hover:text-accent"
            >
              Browse older {category.label} stories →
            </Link>
          </div>
        </>
      )}
    </section>
  );
}
