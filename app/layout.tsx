import type { Metadata } from "next";
import { Newsreader, Archivo } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { categories } from "@/lib/sources";
import { getRecentArticles } from "@/lib/db";
import { SITE_URL, SITE_NAME, SITE_TAGLINE, GA_MEASUREMENT_ID } from "@/lib/site";

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

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const topCategory = categories.find((c) => c.slug === "top")!;
  const articles = getRecentArticles(topCategory.slug, 10);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var s=localStorage.getItem('theme');var d=s?s==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;if(d)document.documentElement.classList.add('dark');}catch(e){}})();`
          }}
        />
      </head>
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
        <Header
          ticker={articles}
          tickerCategory={{ slug: topCategory.slug, label: topCategory.label }}
        />
        <main className="mx-auto max-w-6xl px-4 sm:px-6">{children}</main>
        <Footer />
        <Analytics />
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="ga-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
      </body>
    </html>
  );
}
