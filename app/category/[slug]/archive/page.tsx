import { notFound } from "next/navigation";
import Link from "next/link";
import { getCategory } from "@/lib/sources";
import { getArchivePage } from "@/lib/db";
import { RowCard } from "@/components/NewsCard";
import { accentBg, accentText } from "@/lib/colors";

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
        className="text-xs font-medium uppercase tracking-wide text-inkSoft hover:text-accent"
      >
        ← Back to {category.label}
      </Link>

      <div className="mb-1 mt-3 flex items-center gap-2">
        <span className={`h-1.5 w-1.5 rounded-full ${accentBg(category.color)}`} />
        <span className={`text-xs font-bold uppercase tracking-wide ${accentText(category.color)}`}>
          {category.label} archive
        </span>
      </div>

      <p className="mb-6 text-xs text-muted">
        {total} stories saved since ingestion started.
      </p>

      {articles.length === 0 ? (
        <p className="text-sm text-inkSoft">
          Nothing archived for {category.label} yet — check back after the
          site's been running a while.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
        <nav className="mt-10 flex items-center justify-between border-t border-line pt-6 text-sm">
          {page > 1 ? (
            <Link
              href={`/category/${category.slug}/archive?page=${page - 1}`}
              className="font-medium text-ink hover:text-accent"
            >
              ← Newer
            </Link>
          ) : (
            <span />
          )}
          <span className="text-muted">
            Page {page} of {totalPages}
          </span>
          {page < totalPages ? (
            <Link
              href={`/category/${category.slug}/archive?page=${page + 1}`}
              className="font-medium text-ink hover:text-accent"
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
