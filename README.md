# Khabar Adda

A sectioned news aggregator — Top Stories, Entertainment, Bollywood,
Hollywood, Crime, Politics — built from public RSS feeds. No paid API,
no database, no backend to maintain.

## Run it locally

```
npm install
npm run dev
```

Open http://localhost:3000.

## Before you trust it: check the feeds

RSS URLs on Indian news sites change without warning, and I couldn't
verify every one of them from where this was built. Run:

```
npm run check-feeds
```

This pings every feed in `lib/sources.ts` and tells you which ones are
dead. Replace any failures — search "<site name> rss feed <section>"
and drop the new URL in. Nothing else in the code needs to change.

## How it's structured

- `lib/sources.ts` — the only file you'll edit regularly. Each category
  is a slug, a label, an accent color, and a list of feed URLs. Add a
  new category by adding an entry here; a page for it appears
  automatically at `/category/<slug>`.
- `lib/rss.ts` — fetches every feed for a category in parallel, merges,
  dedupes, sorts by date. If a feed fails, that section just shows
  fewer stories instead of breaking the page — a fully broken feed
  becomes a soft empty-state message, not a crash.
- `app/page.tsx` — homepage: hero + ranked list for Top Stories, then a
  row per other category.
- `app/category/[slug]/page.tsx` — full list for one section.
- Pages revalidate every 15 minutes (`revalidate = 900`), so you're not
  re-fetching every source on every single visitor.

## Adding Google AdSense later

You need a live domain (not localhost) and an approved AdSense account
before any of this does anything:

1. Buy the domain, deploy the site (see below), and apply at
   https://www.google.com/adsense.
2. Once approved, add the loader script in `app/layout.tsx` (there's a
   `TODO` comment marking exactly where) with your publisher ID.
3. Replace the placeholder `<div>` in `components/AdSlot.tsx` with a
   real `<ins class="adsbygoogle">` unit using your ad slot ID.

**Being direct about this part:** AdSense reviews the actual site, and
a page that's entirely reproduced headlines and images from other
publishers with no original content is a common rejection reason —
review guidelines don't want a page that's just a wrapper around other
people's articles. That's separate from the copyright question, too:
using headlines/snippets and linking out is normal for an aggregator,
but pulling full article text or hotlinking images at volume from
sites that don't want it can get your access blocked or worse. If you
want this to pass review and be defensible long-term, plan on adding
something of your own — a daily roundup you write, or short original
takes above each section — not just the raw feed.

## Deploying

Vercel's free tier deploys a Next.js app like this directly from a
GitHub repo with zero config — push the repo, import it on vercel.com,
done. That's the lowest-effort path until you're ready to point your
own domain at it (also free, just add it in Vercel's dashboard once
you own the domain).

## Known gaps / next steps

- The "Crime" category currently falls back to general India news —
  TOI/NDTV don't expose one clean national crime-beat RSS feed. Swap
  in a dedicated one if you find a reliable source, or filter Top
  Stories by keyword later.
- No search or bookmarking yet — this is read-and-click-through only.
- Images come straight from the source feed's `<enclosure>` or
  `media:content` tag; a few publishers don't include one, so some
  cards will show "No image" — that's expected, not a bug.
