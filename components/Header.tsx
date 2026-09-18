import Link from "next/link";
import { Article } from "@/lib/types";
import { categories } from "@/lib/sources";
import { SITE_TAGLINE } from "@/lib/site";
import ThemeToggle from "./ThemeToggle";
import Ticker from "./Ticker";

export default function Header({ ticker }: { ticker: Article[] }) {
  return (
    <header className="border-b border-ink/15 bg-paper">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-6 sm:px-6">
        <Link href="/" className="group">
          <span className="block font-serif text-3xl tracking-tight text-ink sm:text-4xl">
            Khabar Adda
          </span>
          <span className="hidden font-sans text-[11px] uppercase tracking-wide text-ink/40 sm:block">
            {SITE_TAGLINE}
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <span className="hidden font-sans text-xs text-ink/70 sm:block">
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

      <nav className="mx-auto flex max-w-6xl gap-5 overflow-x-auto border-t border-ink/10 px-4 py-2.5 text-sm sm:px-6">
        <Link href="/" className="whitespace-nowrap text-ink hover:underline">
          Home
        </Link>
        {categories.map((c) => (
          <Link
            key={c.slug}
            href={`/category/${c.slug}`}
            className="whitespace-nowrap text-ink/70 hover:text-ink hover:underline"
          >
            {c.label}
          </Link>
        ))}
      </nav>

      <Ticker ticker={ticker} />
    </header>
  );
}
