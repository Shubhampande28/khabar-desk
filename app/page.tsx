import { categories, getCategory } from "@/lib/sources";
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
      <section className="py-10">
        <div className="mb-6 flex items-center gap-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-orange" />
          <h1 className="font-serif text-2xl text-ink sm:text-3xl">
            Top Stories
          </h1>
        </div>

        {heroArticle ? (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-10">
            <div className="lg:col-span-2">
              <FeaturedCard
                article={heroArticle}
                accent="orange"
                category={{ slug: topCategory.slug, label: topCategory.label }}
              />
            </div>
            <div>
              {restTop.map((article, i) => (
                <div key={article.link} className={i >= 3 ? "hidden lg:block" : ""}>
                  <ListItem
                    article={article}
                    accent="orange"
                    category={{ slug: topCategory.slug, label: topCategory.label }}
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-sm text-ink/70">
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
            articles={getRecentArticles(category.slug, 8)}
          />
          {i === 1 && <AdSlot />}
        </div>
      ))}

      <AdSlot />
    </>
  );
}
