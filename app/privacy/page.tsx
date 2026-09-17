import { CONTACT_EMAIL, SITE_NAME } from "@/lib/site";

export const metadata = {
  title: "Privacy Policy",
  description: `How ${SITE_NAME} handles data and cookies.`
};

export default function PrivacyPage() {
  return (
    <section className="mx-auto max-w-2xl py-10">
      <h1 className="font-serif text-3xl text-ink">Privacy Policy</h1>
      <p className="mt-2 text-xs text-ink/50">Last updated {new Date().getFullYear()}</p>

      <div className="mt-6 space-y-5 text-sm leading-relaxed text-ink/80">
        <div>
          <h2 className="font-serif text-lg text-ink">What this site collects</h2>
          <p className="mt-2">
            {SITE_NAME} itself does not require an account, does not collect
            personal information, and does not run its own analytics or
            tracking scripts beyond what's described below.
          </p>
        </div>

        <div>
          <h2 className="font-serif text-lg text-ink">Cookies and ads</h2>
          <p className="mt-2">
            If this site displays Google AdSense ads, Google and its
            advertising partners may use cookies to serve ads based on your
            visits to this and other sites. You can opt out of personalized
            advertising by visiting{" "}
            <a
              href="https://www.google.com/settings/ads"
              className="underline underline-offset-2"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google's Ads Settings
            </a>
            .
          </p>
        </div>

        <div>
          <h2 className="font-serif text-lg text-ink">Hosting and logs</h2>
          <p className="mt-2">
            This site is hosted on Vercel, which may log standard technical
            data (IP address, browser type, request timing) as part of
            normal web server operation. {SITE_NAME} does not access or
            sell this data.
          </p>
        </div>

        <div>
          <h2 className="font-serif text-lg text-ink">Third-party content</h2>
          <p className="mt-2">
            Headlines, images and article links are pulled from public RSS
            feeds of third-party publishers. Clicking through to read a
            full story takes you to that publisher's own site, which has
            its own separate privacy policy.
          </p>
        </div>

        <div>
          <h2 className="font-serif text-lg text-ink">Contact</h2>
          <p className="mt-2">
            Questions about this policy: {" "}
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
