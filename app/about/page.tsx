export const metadata = {
  title: "About",
  description: "What Khabar Desk is and how it works."
};

export default function AboutPage() {
  return (
    <section className="mx-auto max-w-2xl py-10">
      <h1 className="font-serif text-3xl text-ink">About Khabar Desk</h1>

      <div className="mt-6 space-y-4 text-sm leading-relaxed text-ink/80">
        <p>
          Khabar Desk is an independent, one-person news aggregator. It
          brings together headlines from public RSS feeds across Top
          Stories, Entertainment, Bollywood, Hollywood, Crime and Politics,
          so you can scan what's happening across categories without
          hopping between a dozen apps.
        </p>
        <p>
          Every headline links directly back to the original publisher —
          Times of India, NDTV, Hindustan Times, India Today, Bollywood
          Hungama, Variety, Deadline, IndiaTV and others. Khabar Desk
          doesn't republish full articles; it's a pointer to where the
          actual reporting lives.
        </p>
        <p>
          The site refreshes automatically roughly every 15 minutes and has
          no editorial staff — it's a personal project, not a newsroom.
        </p>
      </div>
    </section>
  );
}
