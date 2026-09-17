import Link from "next/link";
import { categories } from "@/lib/sources";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="border-t border-ink/15 py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col gap-8 sm:flex-row sm:justify-between">
          <div>
            <span className="font-serif text-xl text-ink">{SITE_NAME}</span>
            <p className="mt-1 text-xs text-ink/50">{SITE_TAGLINE}</p>
          </div>

          <nav className="flex flex-wrap gap-x-5 gap-y-1 text-xs">
            {categories.map((c) => (
              <Link
                key={c.slug}
                href={`/category/${c.slug}`}
                className="text-ink/60 hover:text-ink hover:underline"
              >
                {c.label}
              </Link>
            ))}
          </nav>
        </div>

        <p className="mt-8 text-xs leading-relaxed text-ink/50">
          Headlines and images on this site are pulled from public RSS feeds
          of the linked publishers and belong to them. {SITE_NAME} only links
          out to the original articles — click any headline to read the full
          story on the source's own site.
        </p>

        <nav className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs">
          <Link href="/about" className="text-ink/50 hover:text-ink hover:underline">
            About
          </Link>
          <Link href="/contact" className="text-ink/50 hover:text-ink hover:underline">
            Contact
          </Link>
          <Link href="/privacy" className="text-ink/50 hover:text-ink hover:underline">
            Privacy Policy
          </Link>
          <Link href="/terms" className="text-ink/50 hover:text-ink hover:underline">
            Terms of Service
          </Link>
        </nav>

        <p className="mt-4 text-xs text-ink/50">© {new Date().getFullYear()} {SITE_NAME}.</p>
      </div>
    </footer>
  );
}
