import Link from "next/link";
import { categories } from "@/lib/sources";
import { getTodayArticlesForReview } from "@/lib/db";
import AdminReviewCard from "@/components/admin/AdminReviewCard";

export const metadata = { title: "Admin review", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default function AdminPage({
  searchParams
}: {
  searchParams: { category?: string };
}) {
  const activeCategory = searchParams.category;
  const articles = getTodayArticlesForReview(activeCategory);

  return (
    <section className="py-10">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl text-ink">Today's stories</h1>
        <form action="/api/admin/logout" method="post">
          <button type="submit" className="text-xs text-inkSoft hover:text-accent">
            Log out
          </button>
        </form>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Link
          href="/admin"
          className={`rounded-full border px-3 py-1 text-xs font-medium ${
            !activeCategory ? "border-accent text-accent" : "border-line text-inkSoft"
          }`}
        >
          All
        </Link>
        {categories.map((c) => (
          <Link
            key={c.slug}
            href={`/admin?category=${c.slug}`}
            className={`rounded-full border px-3 py-1 text-xs font-medium ${
              activeCategory === c.slug ? "border-accent text-accent" : "border-line text-inkSoft"
            }`}
          >
            {c.label}
          </Link>
        ))}
      </div>

      <p className="mt-3 text-xs text-muted">{articles.length} stories ingested today.</p>

      <div className="mt-6 space-y-4">
        {articles.map((article) => (
          <AdminReviewCard key={article.id} article={article} />
        ))}
      </div>
    </section>
  );
}
