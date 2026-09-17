import { CONTACT_EMAIL, SITE_NAME } from "@/lib/site";

export const metadata = {
  title: "Terms of Service",
  description: `Terms for using ${SITE_NAME}.`
};

export default function TermsPage() {
  return (
    <section className="mx-auto max-w-2xl py-10">
      <h1 className="font-serif text-3xl text-ink">Terms of Service</h1>
      <p className="mt-2 text-xs text-ink/50">Last updated {new Date().getFullYear()}</p>

      <div className="mt-6 space-y-5 text-sm leading-relaxed text-ink/80">
        <div>
          <h2 className="font-serif text-lg text-ink">What {SITE_NAME} is</h2>
          <p className="mt-2">
            {SITE_NAME} is a news aggregator that indexes headlines,
            short excerpts and images from public RSS feeds of third-party
            publishers, and links out to their original articles. It is
            provided as-is, free to use, with no login required.
          </p>
        </div>

        <div>
          <h2 className="font-serif text-lg text-ink">Ownership of content</h2>
          <p className="mt-2">
            All headlines, article text, images and trademarks displayed
            through linked feeds remain the property of their respective
            publishers. {SITE_NAME} claims no ownership over third-party
            content and links out to the source for the full story.
          </p>
        </div>

        <div>
          <h2 className="font-serif text-lg text-ink">No warranty</h2>
          <p className="mt-2">
            News feeds are pulled automatically and may be incomplete,
            delayed, or occasionally unavailable if a source feed goes
            down. {SITE_NAME} makes no guarantee of accuracy, completeness
            or availability, and is not responsible for the content of
            linked third-party sites.
          </p>
        </div>

        <div>
          <h2 className="font-serif text-lg text-ink">Changes</h2>
          <p className="mt-2">
            These terms may be updated from time to time without prior
            notice. Continued use of the site after a change means you
            accept the updated terms.
          </p>
        </div>

        <div>
          <h2 className="font-serif text-lg text-ink">Contact</h2>
          <p className="mt-2">
            Questions: {" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="underline underline-offset-2">
              {CONTACT_EMAIL}
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
