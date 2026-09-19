import Link from "next/link";
import { Article } from "@/lib/types";
import { RowCard } from "./NewsCard";
import { AccentColor, accentBg, accentText } from "@/lib/colors";

export default function Section({
  slug,
  label,
  color,
  articles,
  count = 4
}: {
  slug: string;
  label: string;
  color: AccentColor;
  articles: Article[];
  count?: number;
}) {
  const shown = articles.slice(0, count);

  return (
    <section className="border-t border-line py-16">
      <div className="mb-7 flex items-end justify-between">
        <div className="flex items-center gap-2">
          <span className={`h-1.5 w-1.5 rounded-full ${accentBg(color)}`} />
          <span className={`text-xs font-bold uppercase tracking-wide ${accentText(color)}`}>
            {label}
          </span>
        </div>
        <Link
          href={`/category/${slug}`}
          className="text-sm font-medium text-inkSoft transition-colors hover:text-accent"
        >
          View all →
        </Link>
      </div>

      {shown.length === 0 ? (
        <p className="text-sm text-inkSoft">
          No headlines came through for {label} just now — the feed may be
          down. Try again shortly, or check lib/sources.ts.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {shown.map((article) => (
            <RowCard
              key={article.link}
              article={article}
              accent={color}
              category={{ slug, label }}
            />
          ))}
        </div>
      )}
    </section>
  );
}
