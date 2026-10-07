"use client";

// Thin, typed wrapper around the gtag loaded in app/layout.tsx. Keeping the
// event names/params here (instead of scattered gtag() calls) is what
// makes it possible to know every event this site can send from one file.

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

// Headless browsers (Selenium/Puppeteer/Playwright) set this; real browsers
// never do. Catches most automated traffic without touching legitimate
// search crawlers, which don't run this client-side JS as a "visitor" in
// the first place — this only ever suppresses an analytics call, never a
// page response, so it has no effect on crawling/indexing either way.
const BOT_USER_AGENT_SUBSTRINGS = [
  "headlesschrome",
  "pingdom",
  "uptimerobot",
  "gtmetrix",
  "lighthouse",
  "pagespeed",
  "phantomjs"
];

function isLikelyBot(): boolean {
  if (typeof navigator === "undefined") return true;
  if (navigator.webdriver) return true;
  const ua = navigator.userAgent.toLowerCase();
  return BOT_USER_AGENT_SUBSTRINGS.some((s) => ua.includes(s));
}

function sendEvent(name: string, params: Record<string, string | number>): void {
  if (typeof window === "undefined" || !window.gtag) return;
  if (isLikelyBot()) return;
  window.gtag("event", name, params);
}

export function trackOutboundClick(params: {
  sourceName: string;
  category: string;
  articleSlug: string;
}): void {
  sendEvent("outbound_click", {
    source_name: params.sourceName,
    category: params.category,
    article_slug: params.articleSlug
  });
}

export function trackCategoryClick(params: { category: string; fromPage: string }): void {
  sendEvent("category_click", {
    category: params.category,
    from_page: params.fromPage
  });
}

// Wired up when Milestone 6 (related articles) adds the UI that calls this.
export function trackRelatedClick(params: { articleSlug: string; position: number }): void {
  sendEvent("related_click", {
    article_slug: params.articleSlug,
    position: params.position
  });
}

// Wired up when Milestone 7 (newsletter) adds the signup form that calls this.
export function trackNewsletterSignup(): void {
  sendEvent("newsletter_signup", {});
}
