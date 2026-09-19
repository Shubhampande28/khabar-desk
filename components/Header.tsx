import Link from "next/link";
import { Article } from "@/lib/types";
import { SITE_TAGLINE } from "@/lib/site";
import ThemeToggle from "./ThemeToggle";
import Ticker from "./Ticker";
import LogoMark from "./Logo";
import Nav from "./Nav";

export default function Header({
  ticker,
  tickerCategory
}: {
  ticker: Article[];
  tickerCategory: { slug: string; label: string };
}) {
  return (
    <header className="border-b border-line bg-paper">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-6 sm:px-6">
        <Link href="/" className="group flex items-center gap-3">
          <LogoMark className="h-10 w-10 shrink-0 sm:h-12 sm:w-12" />
          <span>
            <span className="logo-wordmark block font-serif text-2xl font-bold tracking-tight sm:text-3xl">
              <span className="text-ink">Khabar</span>
              <span className="text-accent transition-[filter] duration-200 group-hover:brightness-125">
                Adda
              </span>
            </span>
            <span className="logo-tagline hidden font-sans text-[11px] font-medium uppercase tracking-wide text-muted sm:block">
              {SITE_TAGLINE}
            </span>
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <span className="hidden font-sans text-xs text-inkSoft sm:block">
            {new Date().toLocaleDateString("en-IN", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric"
            })}
          </span>
          <ThemeToggle />
        </div>
      </div>

      <Nav />

      <div className="border-t border-line bg-trust px-4 py-2 text-center text-[12.5px] text-trustText sm:px-6">
        <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-accent align-middle" />
        Aggregated from Times of India, NDTV, Hindustan Times, India Today and
        more · Every source linked and credited · Updated every 15 minutes
      </div>

      <Ticker ticker={ticker} category={tickerCategory} />
    </header>
  );
}
