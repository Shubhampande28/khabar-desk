import Link from "next/link";
import { SITE_NAME } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="border-t border-ink/15 py-10">
      <div className="mx-auto max-w-6xl px-4 text-xs leading-relaxed text-ink/50 sm:px-6">
        <p>
          Headlines and images on this site are pulled from public RSS feeds
          of the linked publishers and belong to them. {SITE_NAME} only links
          out to the original articles — click any headline to read the full
          story on the source's own site.
        </p>

        <nav className="mt-4 flex flex-wrap gap-x-4 gap-y-1">
          <Link href="/about" className="hover:text-ink hover:underline">
            About
          </Link>
          <Link href="/contact" className="hover:text-ink hover:underline">
            Contact
          </Link>
          <Link href="/privacy" className="hover:text-ink hover:underline">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-ink hover:underline">
            Terms of Service
          </Link>
        </nav>

        <p className="mt-4">© {new Date().getFullYear()} {SITE_NAME}.</p>
      </div>
    </footer>
  );
}
