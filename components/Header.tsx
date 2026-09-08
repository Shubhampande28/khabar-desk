import Link from "next/link";
import { Article } from "@/lib/types";
import { categories } from "@/lib/sources";

export default function Header({ ticker }: { ticker: Article[] }) {
  return (
    <header className="border-b border-ink/15 bg-paper">
      <div className="mx-auto flex max-w-6xl items-baseline justify-between px-4 py-6 sm:px-6">
        <Link href="/" className="font-serif text-3xl tracking-tight text-ink sm:text-4xl">
          Khabar Desk
        </Link>
        <span className="hidden font-sans text-xs text-ink/50 sm:block">
          {new Date().toLocaleDateString("en-IN", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
          })}
        </span>
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

      {ticker.length > 0 && (
        <div className="overflow-hidden border-t border-ink/15 bg-ink py-2">
          <div className="animate-marquee flex w-max gap-10 whitespace-nowrap text-sm text-paper">
            {[...ticker, ...ticker].map((item, i) => (
              <span key={i}>{item.title}</span>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
