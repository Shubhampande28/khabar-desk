import { CONTACT_EMAIL } from "@/lib/site";

export const metadata = {
  title: "Contact",
  description: "How to reach Khabar Desk."
};

export default function ContactPage() {
  return (
    <section className="mx-auto max-w-2xl py-10">
      <h1 className="font-serif text-3xl text-ink">Contact</h1>

      <div className="mt-6 space-y-4 text-sm leading-relaxed text-ink/80">
        <p>
          Questions, correction requests, or a publisher asking about how
          their feed is used — all of it can go to:
        </p>
        <p>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="font-medium text-ink underline underline-offset-2"
          >
            {CONTACT_EMAIL}
          </a>
        </p>
        <p>
          If you're a publisher and would like your feed removed from
          Khabar Desk, email the above and it'll be taken down promptly.
        </p>
      </div>
    </section>
  );
}
