import { categories, getCategory, CATEGORY_CHILDREN } from "@/lib/sources";
import { getRecentArticles } from "@/lib/db";
import { FeaturedCard, ListItem } from "@/components/NewsCard";
import Section from "@/components/Section";
import AdSlot from "@/components/AdSlot";

// Data comes from a local SQLite database that a background ingestion job
// keeps updated (see scripts/ingest.ts) — always render fresh from it
// rather than caching a build-time snapshot.
export const dynamic = "force-dynamic";

export default function HomePage() {
  const topCategory = getCategory("top")!;
  const otherCategories = categories.filter((c) => c.slug !== "top");

  const topArticles = getRecentArticles(topCategory.slug, 6);
  const [heroArticle, ...restTop] = topArticles;

  return (
    <>
      <section className="py-16">
        <div className="mb-7 flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          <span className="text-xs font-bold uppercase tracking-wide text-accent">
            Top Stories
          </span>
        </div>

        {heroArticle ? (
          <div className="grid grid-cols-1 gap-8 min-[900px]:grid-cols-[2fr_1fr] min-[900px]:gap-10">
            <FeaturedCard
              article={heroArticle}
              accent="accent"
              category={{ slug: topCategory.slug, label: topCategory.label }}
            />
            <div className="rounded-[20px] border border-line bg-card p-5">
              <p className="mb-1 text-xs font-bold uppercase tracking-wide text-muted">
                More Headlines
              </p>
              {restTop.map((article, i) => (
                <div key={article.link} className={i >= 3 ? "hidden min-[900px]:block" : ""}>
                  <ListItem
                    article={article}
                    accent="accent"
                    category={{ slug: topCategory.slug, label: topCategory.label }}
                    index={i + 1}
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-sm text-inkSoft">
            Top stories aren't loading right now. Run{" "}
            <code>npm run ingest</code> to fetch the feeds, or check
            lib/sources.ts.
          </p>
        )}
      </section>

      <AdSlot />

      {otherCategories.map((category, i) => (
        <div key={category.slug}>
          <Section
            slug={category.slug}
            label={category.label}
            color={category.color}
            articles={getRecentArticles(
              category.slug,
              4,
              CATEGORY_CHILDREN[category.slug] ?? []
            )}
          />
          {i === 1 && <AdSlot />}
        </div>
      ))}

      <AdSlot />
    </>
  );
}
