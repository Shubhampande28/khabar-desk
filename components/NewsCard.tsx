import Image from "next/image";
import Link from "next/link";
import { Article } from "@/lib/types";
import { timeAgo } from "@/lib/time";
import { encodeStorySlug } from "@/lib/story";

type AccentColor = "wire" | "teal" | "mustard" | "ink" | "rose" | "navy";
type CardCategory = { slug: string; label: string };

const accentClasses: Record<AccentColor, string> = {
  wire: "bg-wire",
  teal: "bg-teal",
  mustard: "bg-mustard",
  ink: "bg-ink",
  rose: "bg-rose",
  navy: "bg-navy"
};

function Meta({ article, accent }: { article: Article; accent: AccentColor }) {
  return (
    <div className="mt-1.5 flex items-center gap-2 text-xs">
      <span className={`h-1.5 w-1.5 rounded-full ${accentClasses[accent]}`} />
      <span className="font-medium text-ink/90">{article.source}</span>
      {article.isoDate && (
        <>
          <span aria-hidden className="text-ink/60">·</span>
          <span className="text-ink/70">{timeAgo(article.isoDate)}</span>
        </>
      )}
    </div>
  );
}

function storyHref(
  article: Article,
  accent: AccentColor,
  category: CardCategory
): string {
  return `/story/${encodeStorySlug(article, { ...category, color: accent })}`;
}

export function FeaturedCard({
  article,
  accent,
  category
}: {
  article: Article;
  accent: AccentColor;
  category: CardCategory;
}) {
  return (
    <Link href={storyHref(article, accent, category)} className="group block">
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-paperdim">
        {article.image ? (
          <Image
            src={article.image}
            alt={article.title}
            fill
            unoptimized
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-ink/30">
            <span className="font-serif text-sm">No image</span>
          </div>
        )}
      </div>

      <h2 className="text-balance mt-4 font-serif text-2xl leading-snug text-ink group-hover:underline sm:text-3xl">
        {article.title}
      </h2>
      <Meta article={article} accent={accent} />

      {article.contentSnippet && (
        <p className="mt-3 text-sm leading-relaxed text-ink/70">
          {article.contentSnippet}…
        </p>
      )}
    </Link>
  );
}

export function ListItem({
  article,
  accent,
  category
}: {
  article: Article;
  accent: AccentColor;
  category: CardCategory;
}) {
  return (
    <Link
      href={storyHref(article, accent, category)}
      className="group block border-t border-ink/10 py-3.5 first:border-t-0 first:pt-0"
    >
      <h3 className="text-balance font-serif text-base leading-snug text-ink group-hover:underline">
        {article.title}
      </h3>
      <Meta article={article} accent={accent} />
    </Link>
  );
}

export function RowCard({
  article,
  accent,
  category
}: {
  article: Article;
  accent: AccentColor;
  category: CardCategory;
}) {
  return (
    <Link href={storyHref(article, accent, category)} className="group block">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-paperdim">
        {article.image ? (
          <Image
            src={article.image}
            alt={article.title}
            fill
            unoptimized
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-ink/30">
            <span className="font-serif text-xs">No image</span>
          </div>
        )}
      </div>
      <h3 className="text-balance mt-3.5 font-serif text-lg leading-snug text-ink group-hover:underline">
        {article.title}
      </h3>
      <Meta article={article} accent={accent} />
    </Link>
  );
}
