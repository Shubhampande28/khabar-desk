import Link from "next/link";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="border-t border-line py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <span className="font-serif text-xl font-bold tracking-tight">
          <span className="text-ink">Khabar</span>
          <span className="text-accent">Adda</span>
        </span>
        <p className="mt-1 text-xs text-muted">{SITE_TAGLINE}</p>

        <p className="mt-8 text-xs leading-relaxed text-inkSoft">
          Headlines and images on this site are pulled from public RSS feeds
          of the linked publishers and belong to them. {SITE_NAME} only links
          out to the original articles — click any headline to read the full
          story on the source's own site.
        </p>

        <div className="mt-6 flex flex-col gap-4 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted">
            © {new Date().getFullYear()} {SITE_NAME}.
          </p>
          <nav className="flex flex-wrap gap-x-5 gap-y-1 text-xs">
            <Link href="/about" className="text-inkSoft hover:text-accent hover:underline">
              About
            </Link>
            <Link href="/contact" className="text-inkSoft hover:text-accent hover:underline">
              Contact
            </Link>
            <Link href="/privacy" className="text-inkSoft hover:text-accent hover:underline">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-inkSoft hover:text-accent hover:underline">
              Terms of Service
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
