import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { decodeStorySlug } from "@/lib/story";
import { timeAgo } from "@/lib/time";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { shouldSkipOptimization } from "@/lib/image";
import { AccentColor, accentBg } from "@/lib/colors";
import OutboundLink from "@/components/OutboundLink";
import { getArticleEditorial } from "@/lib/db";

export function generateMetadata({ params }: { params: { slug: string } }) {
  const story = decodeStorySlug(params.slug);
  if (!story) return { title: "Story not found" };

  const editorial = getArticleEditorial(story.l, story.cs);
  const reviewed = Boolean(editorial?.reviewedAt);

  return {
    // Bypasses the root layout's "%s — Khabar Adda" template: article pages
    // use a plain "|" instead, per the agreed title format.
    title: { absolute: `${story.t} | ${SITE_NAME}` },
    description:
      (reviewed && editorial?.ourSummary) ||
      story.c ||
      `${story.t} — via ${story.s}, curated by ${SITE_NAME}.`,
    openGraph: story.i ? { images: [{ url: story.i }] } : undefined,
    // Thin, unreviewed pages (headline + feed snippet, no original value)
    // shouldn't compete for ranking — see Milestone 3. Still followable so
    // Googlebot keeps discovering category/other links from the page.
    robots: reviewed ? undefined : { index: false, follow: true }
  };
}

export default function StoryPage({ params }: { params: { slug: string } }) {
  const story = decodeStorySlug(params.slug);
  if (!story) notFound();

  const editorial = getArticleEditorial(story.l, story.cs);
  const reviewed = Boolean(editorial?.reviewedAt && editorial?.ourSummary);

  const jsonLd = reviewed
    ? {
        "@context": "https://schema.org",
        "@type": "NewsArticle",
        headline: story.t,
        datePublished: story.d || undefined,
        dateModified: editorial!.reviewedAt || story.d || undefined,
        image: story.i ? [story.i] : undefined,
        author: {
          "@type": "Organization",
          name: editorial!.editorName || "Khabar Adda Editorial",
          url: `${SITE_URL}/about`
        },
        publisher: {
          "@type": "Organization",
          name: SITE_NAME,
          logo: {
            "@type": "ImageObject",
            url: `${SITE_URL}/apple-icon`
          }
        },
        isBasedOn: story.l,
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": `${SITE_URL}/story/${params.slug}`
        }
      }
    : null;

  return (
    <article className="mx-auto max-w-2xl py-10">
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}

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
        <span>via</span>
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

      {reviewed ? (
        <>
          {editorial!.contentWarning && (
            <p className="mt-6 rounded-lg bg-crime/10 px-4 py-2 text-xs font-medium text-crime">
              This story covers a sensitive topic. Reader discretion advised.
            </p>
          )}

          <div className="mt-6 rounded-2xl border border-line bg-card p-5">
            <p className="text-base leading-relaxed text-ink">{editorial!.ourSummary}</p>
            {editorial!.whyItMatters && (
              <div className="mt-4 border-t border-line pt-4">
                <p className="text-xs font-bold uppercase tracking-wide text-accent">
                  Why it matters
                </p>
                <p className="mt-1 text-sm leading-relaxed text-inkSoft">
                  {editorial!.whyItMatters}
                </p>
              </div>
            )}
          </div>

          <p className="mt-3 text-xs text-muted">
            Reviewed by{" "}
            <Link href="/about" className="font-medium text-accent hover:underline">
              {editorial!.editorName || "Khabar Adda Editorial"}
            </Link>
          </p>
        </>
      ) : (
        story.c && (
          <blockquote className="mt-6 border-l-2 border-line pl-4 text-base leading-relaxed text-inkSoft">
            {story.c}
          </blockquote>
        )
      )}

      <p className="mt-6 text-sm leading-relaxed text-inkSoft">
        {SITE_NAME} curates headlines like this across Top Stories,
        Entertainment, Bollywood, Hollywood, Crime and Politics from public
        RSS feeds. This page links out to {story.s}'s own reporting rather
        than reproducing it — {reviewed ? "the summary above is ours" : "the excerpt above comes from " + story.s + "'s own feed"}.
      </p>

      <OutboundLink
        href={story.l}
        sourceName={story.s}
        category={story.cs}
        articleSlug={params.slug}
        className="mt-8 inline-block rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition hover:brightness-110"
      >
        Read the full story on {story.s} ↗
      </OutboundLink>
    </article>
  );
}
