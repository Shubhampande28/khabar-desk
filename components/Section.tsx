import Link from "next/link";
import { Article } from "@/lib/types";
import { RowCard } from "./NewsCard";

type AccentColor = "wire" | "teal" | "mustard" | "ink" | "rose" | "navy";

const accentClasses: Record<AccentColor, string> = {
  wire: "bg-wire",
  teal: "bg-teal",
  mustard: "bg-mustard",
  ink: "bg-ink",
  rose: "bg-rose",
  navy: "bg-navy"
};

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
    <section className="border-t border-ink/15 py-10">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className={`h-2.5 w-2.5 ${accentClasses[color]}`} />
          <h2 className="font-serif text-xl text-ink sm:text-2xl">{label}</h2>
        </div>
        <Link
          href={`/category/${slug}`}
          className="text-sm text-ink/60 underline-offset-4 hover:text-ink hover:underline"
        >
          View all
        </Link>
      </div>

      {shown.length === 0 ? (
        <p className="text-sm text-ink/50">
          No headlines came through for {label} just now — the feed may be
          down. Try again shortly, or check lib/sources.ts.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4">
          {shown.map((article) => (
            <RowCard key={article.link} article={article} accent={color} />
          ))}
        </div>
      )}
    </section>
  );
}
