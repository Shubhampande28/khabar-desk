"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Article } from "@/lib/types";
import { encodeStorySlug } from "@/lib/story";

type TickerCategory = { slug: string; label: string };

// Hidden on the homepage specifically: the Top Stories section right below
// the header shows this exact same content, so the ticker there is pure
// duplication rather than a useful "meanwhile, elsewhere" signal. On every
// other page it's a normal persistent breaking-news strip.
export default function Ticker({
  ticker,
  category
}: {
  ticker: Article[];
  category: TickerCategory;
}) {
  const pathname = usePathname();
  if (ticker.length === 0 || pathname === "/") return null;

  return (
    <div className="overflow-hidden border-t border-ink/15 bg-ink py-2">
      <div className="animate-marquee flex w-max whitespace-nowrap text-sm text-paper">
        {/* Real, focusable, screen-reader-visible copy */}
        <div className="flex gap-10">
          {ticker.map((item, i) => (
            <Link
              key={i}
              href={`/story/${encodeStorySlug(item, { ...category, color: "wire" })}`}
              className="hover:underline"
            >
              {item.title}
            </Link>
          ))}
        </div>
        {/* Visual-only duplicate so the marquee loop is seamless — hidden
            from assistive tech so headlines aren't announced twice with no
            way to act on the second copy. */}
        <div aria-hidden="true" className="ml-10 flex gap-10">
          {ticker.map((item, i) => (
            <span key={i}>{item.title}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
