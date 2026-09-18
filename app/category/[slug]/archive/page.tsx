import { notFound } from "next/navigation";
import Link from "next/link";
import { getCategory } from "@/lib/sources";
import { getArchivePage } from "@/lib/db";
import { RowCard } from "@/components/NewsCard";

const accentDot: Record<string, string> = {
  wire: "bg-wire",
  teal: "bg-teal",
  mustard: "bg-mustard",
  ink: "bg-ink",
  rose: "bg-rose",
  navy: "bg-navy"
};

export const dynamic = "force-dynamic";

export function generateMetadata({ params }: { params: { slug: string } }) {
  const category = getCategory(params.slug);
  if (!category) return { title: "Not found" };
  return {
    title: `${category.label} archive`,
    description: `Older ${category.label} stories, paginated.`
  };
}

export default function ArchivePage({
  params,
  searchParams
}: {
  params: { slug: string };
  searchParams: { page?: string };
}) {
  const category = getCategory(params.slug);
  if (!category) notFound();

  const page = Math.max(1, parseInt(searchParams.page || "1", 10) || 1);
  const { articles, total, totalPages } = getArchivePage(category.slug, page);

  if (page > 1 && articles.length === 0) notFound();

  return (
    <section className="py-10">
      <Link
        href={`/category/${category.slug}`}
        className="text-xs font-medium uppercase tracking-wide text-ink/60 hover:text-ink"
      >
        ← Back to {category.label}
      </Link>

      <div className="mb-6 mt-3 flex items-center gap-2.5">
        <span className={`h-2.5 w-2.5 ${accentDot[category.color]}`} />
        <h1 className="text-balance font-serif text-2xl text-ink sm:text-3xl">
          {category.label} archive
        </h1>
      </div>

      <p className="mb-6 text-xs text-ink/50">
        {total} stories saved since ingestion started.
      </p>

      {articles.length === 0 ? (
        <p className="text-sm text-ink/50">
          Nothing archived for {category.label} yet — check back after the
          site's been running a while.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
          {articles.map((article) => (
            <RowCard
              key={article.link}
              article={article}
              accent={category.color}
              category={{ slug: category.slug, label: category.label }}
            />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <nav className="mt-10 flex items-center justify-between border-t border-ink/10 pt-6 text-sm">
          {page > 1 ? (
            <Link
              href={`/category/${category.slug}/archive?page=${page - 1}`}
              className="font-medium text-ink hover:underline"
            >
              ← Newer
            </Link>
          ) : (
            <span />
          )}
          <span className="text-ink/50">
            Page {page} of {totalPages}
          </span>
          {page < totalPages ? (
            <Link
              href={`/category/${category.slug}/archive?page=${page + 1}`}
              className="font-medium text-ink hover:underline"
            >
              Older →
            </Link>
          ) : (
            <span />
          )}
        </nav>
      )}
    </section>
  );
}
