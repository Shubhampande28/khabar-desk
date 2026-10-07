import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { decodeStorySlug } from "@/lib/story";
import { timeAgo } from "@/lib/time";
import { SITE_NAME } from "@/lib/site";
import { shouldSkipOptimization } from "@/lib/image";
import { AccentColor, accentBg } from "@/lib/colors";
import OutboundLink from "@/components/OutboundLink";

export function generateMetadata({ params }: { params: { slug: string } }) {
  const story = decodeStorySlug(params.slug);
  if (!story) return { title: "Story not found" };

  return {
    // Bypasses the root layout's "%s — Khabar Adda" template: article pages
    // use a plain "|" instead, per the agreed title format.
    title: { absolute: `${story.t} | ${SITE_NAME}` },
    description: story.c || `${story.t} — via ${story.s}, curated by ${SITE_NAME}.`,
    openGraph: story.i ? { images: [{ url: story.i }] } : undefined
  };
}

export default function StoryPage({ params }: { params: { slug: string } }) {
  const story = decodeStorySlug(params.slug);
  if (!story) notFound();

  return (
    <article className="mx-auto max-w-2xl py-10">
      <Link
        href={`/category/${story.cs}`}
        className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-inkSoft hover:text-accent"
      >
        <span className={`h-1.5 w-1.5 rounded-full ${accentBg(story.ac as AccentColor)}`} />
        {story.cl}
      </Link>

      <h1 className="text-balance mt-3 font-serif text-3xl leading-snug text-ink sm:text-4xl">
        {story.t}
      </h1>

      <div className="mt-2 flex items-center gap-2 text-sm text-inkSoft">
        <span className="font-semibold text-ink">{story.s}</span>
        {story.d && (
          <>
            <span aria-hidden>·</span>
            <span>{timeAgo(story.d)}</span>
          </>
        )}
      </div>

      {story.i && (
        <div className="relative mt-6 aspect-[16/9] w-full overflow-hidden rounded-2xl bg-paperdim">
          <Image
            src={story.i}
            alt={story.t}
            fill
            unoptimized={shouldSkipOptimization(story.i)}
            sizes="(min-width: 672px) 672px, 100vw"
            className="object-cover"
          />
        </div>
      )}

      {story.c && (
        <blockquote className="mt-6 border-l-2 border-line pl-4 text-base leading-relaxed text-inkSoft">
          {story.c}
        </blockquote>
      )}

      <p className="mt-6 text-sm leading-relaxed text-inkSoft">
        {SITE_NAME} curates headlines like this across Top Stories,
        Entertainment, Bollywood, Hollywood, Crime and Politics from public
        RSS feeds. This page links out to {story.s}'s own reporting rather
        than reproducing it — the excerpt above comes from {story.s}'s own
        feed.
      </p>

      <OutboundLink
        href={story.l}
        sourceName={story.s}
        category={story.cs}
        articleSlug={params.slug}
        className="mt-8 inline-block rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition hover:brightness-110"
      >
        Read full story on {story.s} →
      </OutboundLink>
    </article>
  );
}
