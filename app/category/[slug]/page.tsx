import { notFound } from "next/navigation";
import { categories, getCategory } from "@/lib/sources";
import { getArticlesForFeeds } from "@/lib/rss";
import { RowCard } from "@/components/NewsCard";
import AdSlot from "@/components/AdSlot";

const accentDot: Record<string, string> = {
  wire: "bg-wire",
  teal: "bg-teal",
  mustard: "bg-mustard",
  ink: "bg-ink",
  rose: "bg-rose",
  navy: "bg-navy"
};

export const revalidate = 900;

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const category = getCategory(params.slug);
  if (!category) return { title: "Not found" };
  return {
    title: category.label,
    description: `Latest ${category.label} news, updated throughout the day.`
  };
}

export default async function CategoryPage({
  params
}: {
  params: { slug: string };
}) {
  const category = getCategory(params.slug);
  if (!category) notFound();

  const { articles, failedFeeds } = await getArticlesForFeeds(
    category.feeds,
    30
  );

  return (
    <section className="py-10">
      <div className="mb-6 flex items-center gap-2.5">
        <span className={`h-2.5 w-2.5 ${accentDot[category.color]}`} />
        <h1 className="text-balance font-serif text-2xl text-ink sm:text-3xl">
          {category.label}
        </h1>
      </div>

      {failedFeeds.length > 0 && articles.length > 0 && (
        <p className="mb-6 text-xs text-ink/50">
          {failedFeeds.length} of {category.feeds.length} sources for this
          section didn't respond — showing what came through.
        </p>
      )}

      {articles.length === 0 ? (
        <p className="text-sm text-ink/50">
          None of the feeds for {category.label} responded. Check the URLs in
          lib/sources.ts.
        </p>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
            {articles.slice(0, 12).map((article) => (
              <RowCard key={article.link} article={article} accent={category.color} />
            ))}
          </div>

          {articles.length > 12 && <AdSlot />}

          <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
            {articles.slice(12).map((article) => (
              <RowCard key={article.link} article={article} accent={category.color} />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
