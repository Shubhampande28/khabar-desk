import Link from "next/link";
import { searchArticles } from "@/lib/db";
import { getCategory } from "@/lib/sources";
import { RowCard } from "@/components/NewsCard";

export const dynamic = "force-dynamic";

export function generateMetadata({
  searchParams
}: {
  searchParams: { q?: string };
}) {
  const q = searchParams.q?.trim() || "";
  return { title: q ? `Search: ${q}` : "Search" };
}

export default function SearchPage({
  searchParams
}: {
  searchParams: { q?: string };
}) {
  const query = searchParams.q?.trim() || "";
  const results = query ? searchArticles(query, 24) : [];

  return (
    <section className="py-10">
      <h1 className="font-serif text-2xl text-ink">Search</h1>

      <form action="/search" method="get" className="mt-4 flex gap-2">
        <input
          type="text"
          name="q"
          defaultValue={query}
          placeholder="Search headlines…"
          className="w-full rounded-full border border-line bg-card px-4 py-2 text-sm text-ink outline-none focus:border-accent"
        />
        <button
          type="submit"
          className="rounded-full bg-accent px-5 py-2 text-sm font-semibold text-white"
        >
          Search
        </button>
      </form>

      {query && (
        <p className="mt-6 text-sm text-inkSoft">
          {results.length > 0
            ? `${results.length} result${results.length === 1 ? "" : "s"} for "${query}"`
            : `No headlines matching "${query}" — try a different word.`}
        </p>
      )}

      {results.length > 0 && (
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {results.map((article) => {
            const category = getCategory(article.categorySlug);
            return (
              <RowCard
                key={article.link}
                article={article}
                accent={category?.color ?? "accent"}
                category={{
                  slug: category?.slug ?? article.categorySlug,
                  label: category?.label ?? article.categorySlug
                }}
              />
            );
          })}
        </div>
      )}

      {!query && (
        <p className="mt-6 text-sm text-inkSoft">
          Type a word or phrase from a headline above.{" "}
          <Link href="/" className="font-medium text-accent hover:underline">
            Or browse the homepage →
          </Link>
        </p>
      )}
    </section>
  );
}
