import Link from "next/link";
import { categories } from "@/lib/sources";
import { getRecentArticles } from "@/lib/db";
import { RowCard } from "@/components/NewsCard";

// Otherwise this gets prerendered once at build time and the "latest
// headlines" list goes stale between deploys (ingestion runs every 15 min,
// builds don't).
export const dynamic = "force-dynamic";

export default function NotFound() {
  const latest = getRecentArticles("top", 8);

  return (
    <section className="py-14">
      <p className="text-xs font-bold uppercase tracking-wide text-accent">404</p>
      <h1 className="text-balance mt-2 font-serif text-3xl leading-snug text-ink sm:text-4xl">
        This page doesn't exist anymore.
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-inkSoft">
        यह पेज अब मौजूद नहीं है — शायद लिंक पुराना हो गया है या बदल गया है। नीचे
        होमपेज, सभी सेक्शन और ताज़ा खबरें दी गई हैं।
      </p>
      <p className="mt-1 text-sm leading-relaxed text-inkSoft">
        The link may be old, mistyped, or the page it pointed to has moved.
        Try a search, jump to a section below, or head back to the homepage.
      </p>

      <form action="/search" method="get" className="mt-6 flex max-w-md gap-2">
        <input
          type="text"
          name="q"
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

      <div className="mt-8 flex flex-wrap gap-2">
        <Link
          href="/"
          className="rounded-full border border-line px-4 py-1.5 text-sm font-medium text-ink hover:border-accent hover:text-accent"
        >
          Homepage
        </Link>
        {categories.map((c) => (
          <Link
            key={c.slug}
            href={`/category/${c.slug}`}
            className="rounded-full border border-line px-4 py-1.5 text-sm font-medium text-ink hover:border-accent hover:text-accent"
          >
            {c.label}
          </Link>
        ))}
      </div>

      {latest.length > 0 && (
        <div className="mt-10">
          <p className="mb-4 text-xs font-bold uppercase tracking-wide text-muted">
            Latest headlines
          </p>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {latest.map((article) => (
              <RowCard
                key={article.link}
                article={article}
                accent="accent"
                category={{ slug: "top", label: "Top Stories" }}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
