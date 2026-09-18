import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { decodeStorySlug } from "@/lib/story";
import { timeAgo } from "@/lib/time";
import { SITE_NAME } from "@/lib/site";

const accentClasses: Record<string, string> = {
  wire: "bg-wire",
  teal: "bg-teal",
  mustard: "bg-mustard",
  ink: "bg-ink",
  rose: "bg-rose",
  navy: "bg-navy"
};

export function generateMetadata({ params }: { params: { slug: string } }) {
  const story = decodeStorySlug(params.slug);
  if (!story) return { title: "Story not found" };

  return {
    title: story.t,
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
        className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-ink/75 hover:text-ink"
      >
        <span
          className={`h-1.5 w-1.5 rounded-full ${
            accentClasses[story.ac] || "bg-ink"
          }`}
        />
        {story.cl}
      </Link>

      <h1 className="text-balance mt-3 font-serif text-3xl leading-snug text-ink sm:text-4xl">
        {story.t}
      </h1>

      <div className="mt-2 flex items-center gap-2 text-sm text-ink/75">
        <span className="font-medium">{story.s}</span>
        {story.d && (
          <>
            <span aria-hidden>·</span>
            <span>{timeAgo(story.d)}</span>
          </>
        )}
      </div>

      {story.i && (
        <div className="relative mt-6 aspect-[16/9] w-full overflow-hidden bg-paperdim">
          <Image
            src={story.i}
            alt={story.t}
            fill
            unoptimized
            className="object-cover"
          />
        </div>
      )}

      {story.c && (
        <blockquote className="mt-6 border-l-2 border-ink/20 pl-4 text-base leading-relaxed text-ink/80">
          {story.c}…
        </blockquote>
      )}

      <p className="mt-6 text-sm leading-relaxed text-ink/75">
        {SITE_NAME} curates headlines like this across Top Stories,
        Entertainment, Bollywood, Hollywood, Crime and Politics from public
        RSS feeds. This page links out to {story.s}'s own reporting rather
        than reproducing it — the excerpt above comes from {story.s}'s own
        feed.
      </p>

      <a
        href={story.l}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-8 inline-block rounded-full bg-ink px-6 py-3 text-sm font-medium text-paper transition hover:bg-ink/90"
      >
        Read full story on {story.s} →
      </a>
    </article>
  );
}
