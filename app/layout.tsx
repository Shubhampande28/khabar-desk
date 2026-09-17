import type { Metadata } from "next";
import { Newsreader, Archivo } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { categories } from "@/lib/sources";
import { getArticlesForFeeds } from "@/lib/rss";
import { SITE_URL, SITE_NAME, SITE_TAGLINE } from "@/lib/site";

const headline = Newsreader({
  subsets: ["latin"],
  variable: "--font-headline",
  style: ["normal", "italic"]
});

const body = Archivo({
  subsets: ["latin"],
  variable: "--font-body"
});

const description =
  "Top stories, entertainment, Bollywood, Hollywood, crime and politics, pulled together in one place.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — ${SITE_TAGLINE}`,
    template: `%s — ${SITE_NAME}`
  },
  description,
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description,
    url: SITE_URL
  },
  twitter: {
    card: "summary",
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description
  }
};

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const topCategory = categories.find((c) => c.slug === "top")!;
  const { articles } = await getArticlesForFeeds(topCategory.feeds, 10);

  return (
    <html lang="en">
      {/*
        TODO once AdSense approves your domain: add the loader script here, e.g.

        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
          crossOrigin="anonymous"
        />

        Then swap the placeholder <div> in components/AdSlot.tsx for a real
        <ins class="adsbygoogle"> unit using your ad slot ID.
      */}
      <body className={`${headline.variable} ${body.variable} font-sans`}>
        <Header ticker={articles} />
        <main className="mx-auto max-w-6xl px-4 sm:px-6">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
