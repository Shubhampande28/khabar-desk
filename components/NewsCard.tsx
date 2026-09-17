import Image from "next/image";
import { Article } from "@/lib/types";
import { timeAgo } from "@/lib/time";

type AccentColor = "wire" | "teal" | "mustard" | "ink" | "rose" | "navy";

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
    <div className="mt-1.5 flex items-center gap-2 text-xs text-ink/60">
      <span className={`h-1.5 w-1.5 rounded-full ${accentClasses[accent]}`} />
      <span className="font-medium">{article.source}</span>
      {article.isoDate && (
        <>
          <span aria-hidden>·</span>
          <span>{timeAgo(article.isoDate)}</span>
        </>
      )}
    </div>
  );
}

export function FeaturedCard({
  article,
  accent
}: {
  article: Article;
  accent: AccentColor;
}) {
  return (
    <a
      href={article.link}
      target="_blank"
      rel="noopener noreferrer"
      className="group block"
    >
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
    </a>
  );
}

export function ListItem({
  article,
  accent
}: {
  article: Article;
  accent: AccentColor;
}) {
  return (
    <a
      href={article.link}
      target="_blank"
      rel="noopener noreferrer"
      className="group block border-t border-ink/10 py-3.5 first:border-t-0 first:pt-0"
    >
      <h3 className="text-balance font-serif text-base leading-snug text-ink group-hover:underline">
        {article.title}
      </h3>
      <Meta article={article} accent={accent} />
    </a>
  );
}

export function RowCard({
  article,
  accent
}: {
  article: Article;
  accent: AccentColor;
}) {
  return (
    <a
      href={article.link}
      target="_blank"
      rel="noopener noreferrer"
      className="group block"
    >
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
    </a>
  );
}
