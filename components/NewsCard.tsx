import Image from "next/image";
import Link from "next/link";
import { Article } from "@/lib/types";
import { timeAgo } from "@/lib/time";
import { encodeStorySlug } from "@/lib/story";
import { shouldSkipOptimization } from "@/lib/image";
import { AccentColor, accentBg, accentText } from "@/lib/colors";

type CardCategory = { slug: string; label: string };

function Meta({ article, accent }: { article: Article; accent: AccentColor }) {
  return (
    <div className="mt-1.5 flex items-center gap-2 text-xs">
      <span className={`h-1.5 w-1.5 rounded-full ${accentBg(accent)}`} />
      <span className="font-semibold text-ink">{article.source}</span>
      {article.isoDate && (
        <>
          <span aria-hidden className="text-muted">·</span>
          <span className="text-muted">{timeAgo(article.isoDate)}</span>
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
    <Link
      href={storyHref(article, accent, category)}
      className="group block overflow-hidden rounded-2xl border border-line bg-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
    >
      <div className="relative h-[280px] w-full overflow-hidden bg-paperdim sm:h-[340px] lg:h-[420px]">
        {article.image ? (
          <>
            <Image
              src={article.image}
              alt={article.title}
              fill
              unoptimized={shouldSkipOptimization(article.image)}
              sizes="(min-width: 1024px) 66vw, 100vw"
              className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
            <h2 className="text-balance absolute inset-x-0 bottom-0 p-5 font-serif text-2xl leading-snug text-white sm:p-6 sm:text-3xl">
              {article.title}
            </h2>
          </>
        ) : (
          <div className="flex h-full w-full items-center justify-center text-ink/30">
            <span className="font-serif text-sm">No image</span>
          </div>
        )}
      </div>

      <div className="p-5 sm:p-6">
        {!article.image && (
          <h2 className="text-balance font-serif text-2xl leading-snug text-ink sm:text-3xl">
            {article.title}
          </h2>
        )}
        {article.contentSnippet && (
          <p className="mt-1 text-sm leading-relaxed text-inkSoft">
            {article.contentSnippet}…
          </p>
        )}
        <Meta article={article} accent={accent} />
      </div>
    </Link>
  );
}

export function ListItem({
  article,
  accent,
  category,
  index
}: {
  article: Article;
  accent: AccentColor;
  category: CardCategory;
  index: number;
}) {
  return (
    <Link
      href={storyHref(article, accent, category)}
      className="group flex gap-4 border-t border-line py-4 first:border-t-0 first:pt-0"
    >
      <span className={`font-serif text-2xl font-bold tabular-nums ${accentText(accent)}`}>
        {String(index).padStart(2, "0")}
      </span>
      <div>
        <h3 className="text-balance font-serif text-base leading-snug text-ink group-hover:text-accent">
          {article.title}
        </h3>
        <Meta article={article} accent={accent} />
      </div>
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
    <Link
      href={storyHref(article, accent, category)}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
    >
      <div className="relative h-[168px] w-full shrink-0 overflow-hidden bg-paperdim">
        {article.image ? (
          <>
            <Image
              src={article.image}
              alt={article.title}
              fill
              unoptimized={shouldSkipOptimization(article.image)}
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
              className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            />
          </>
        ) : (
          <div className="flex h-full w-full items-center justify-center text-ink/30">
            <span className="font-serif text-xs">No image</span>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-2 font-serif text-lg leading-snug text-ink group-hover:text-accent">
          {article.title}
        </h3>
        <div className="mt-auto pt-3">
          <Meta article={article} accent={accent} />
        </div>
      </div>
    </Link>
  );
}
