"use client";

import { usePathname } from "next/navigation";
import { Article } from "@/lib/types";

// Hidden on the homepage specifically: the Top Stories section right below
// the header shows this exact same content, so the ticker there is pure
// duplication rather than a useful "meanwhile, elsewhere" signal. On every
// other page it's a normal persistent breaking-news strip.
export default function Ticker({ ticker }: { ticker: Article[] }) {
  const pathname = usePathname();
  if (ticker.length === 0 || pathname === "/") return null;

  return (
    <div
      aria-hidden="true"
      className="overflow-hidden border-t border-ink/15 bg-ink py-2"
    >
      <div className="animate-marquee flex w-max gap-10 whitespace-nowrap text-sm text-paper">
        {[...ticker, ...ticker].map((item, i) => (
          <span key={i}>{item.title}</span>
        ))}
      </div>
    </div>
  );
}
