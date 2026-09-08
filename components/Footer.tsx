export default function Footer() {
  return (
    <footer className="border-t border-ink/15 py-10">
      <div className="mx-auto max-w-6xl px-4 text-xs leading-relaxed text-ink/50 sm:px-6">
        <p>
          Headlines and images on this site are pulled from public RSS feeds
          of the linked publishers and belong to them. Khabar Desk only links
          out to the original articles — click any headline to read the full
          story on the source's own site.
        </p>
        <p className="mt-3">© {new Date().getFullYear()} Khabar Desk.</p>
      </div>
    </footer>
  );
}
