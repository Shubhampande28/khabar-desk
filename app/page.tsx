import { categories, getCategory } from "@/lib/sources";
import { getArticlesForFeeds } from "@/lib/rss";
import { FeaturedCard, ListItem } from "@/components/NewsCard";
import Section from "@/components/Section";
import AdSlot from "@/components/AdSlot";

export const revalidate = 900;

export default async function HomePage() {
  const topCategory = getCategory("top")!;
  const otherCategories = categories.filter((c) => c.slug !== "top");

  const [topResult, ...otherResults] = await Promise.all([
    getArticlesForFeeds(topCategory.feeds, 6),
    ...otherCategories.map((c) => getArticlesForFeeds(c.feeds, 8))
  ]);

  const [heroArticle, ...restTop] = topResult.articles;

  return (
    <>
      <section className="py-10">
        <div className="mb-6 flex items-center gap-2.5">
          <span className="h-2.5 w-2.5 bg-wire" />
          <h1 className="font-serif text-2xl text-ink sm:text-3xl">
            Top Stories
          </h1>
        </div>

        {heroArticle ? (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-10">
            <div className="lg:col-span-2">
              <FeaturedCard article={heroArticle} accent="wire" />
            </div>
            <div>
              {restTop.map((article) => (
                <ListItem key={article.link} article={article} accent="wire" />
              ))}
            </div>
          </div>
        ) : (
          <p className="text-sm text-ink/50">
            Top stories aren't loading right now. Check lib/sources.ts and
            run scripts/check-feeds.mjs to see which feed is down.
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
            articles={otherResults[i].articles}
          />
          {i === 1 && <AdSlot />}
        </div>
      ))}

      <AdSlot />
    </>
  );
}
