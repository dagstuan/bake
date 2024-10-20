import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { draftMode } from "next/headers";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Nav } from "@/components/Nav/Nav";
import { Footer } from "@/components/Footer/Footer";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SearchAction, WebSite, WithContext } from "schema-dts";
import { JsonLd } from "@/components/JsonLd/JsonLd";
import { homeSeoQuery } from "@/sanity/lib/queries";
import { urlForImage } from "@/sanity/lib/utils";
import {
  openGraphMetadata,
  siteName,
  siteUrl,
  twitterMetadata,
} from "./shared-metadata";
import { loadQuery } from "@/sanity/loader/loadQuery";
import dynamic from "next/dynamic";

const LiveVisualEditing = dynamic(
  () => import("@/sanity/loader/LiveVisualEditing"),
);

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export async function generateMetadata(): Promise<Metadata> {
  const { data: homeSeo } = await loadQuery(homeSeoQuery);

  const metaDescription = homeSeo?.seo?.metaDescription ?? "";

  const imageWidth = 800;
  const imageHeight = 600;

  const imageUrl = homeSeo?.seo?.openGraphImage
    ? (urlForImage(homeSeo?.seo?.openGraphImage)
        ?.width(imageWidth)
        .height(600)
        .dpr(1)
        .url() ?? undefined)
    : undefined;

  return {
    title: {
      default: "Bakdel",
      template: "%s | Bakdel",
    },
    keywords: [
      "bake",
      "mat",
      "baking",
      "oppskrifter",
      "bakeoppskrifter",
      "matoppskrifter",
      "skalere",
      "skalerbare",
      "skalerbar",
    ],
    description: metaDescription,
    openGraph: {
      ...openGraphMetadata,
      title: homeSeo?.seo?.metaTitle ?? openGraphMetadata?.title ?? siteName,
      description: metaDescription,
      images: imageUrl
        ? [
            {
              url: imageUrl,
              width: imageWidth,
              height: imageHeight,
            },
          ]
        : [],
    },
    twitter: {
      ...twitterMetadata,
      description: metaDescription,
      images: imageUrl
        ? [
            {
              url: imageUrl,
              width: imageWidth,
              height: imageHeight,
            },
          ]
        : [],
    },
    robots: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
      googleBot: "index, follow",
    },
    applicationName: "Bakdel",
    icons: {
      icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🍞</text></svg>",
    },
  };
}

const searchAction = {
  "@type": "SearchAction",
  target: `${siteUrl}/oppskrifter?query={search_term_string}`,
  "query-input": "required name=search_term_string",
} satisfies SearchAction & { "query-input": string };

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { data: homeSeo } = await loadQuery(homeSeoQuery);

  const jsonLd: WithContext<WebSite> = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Bakdel",
    description: homeSeo?.seo?.metaDescription ?? "",
    url: siteUrl,
    potentialAction: searchAction,
  };

  return (
    <html lang="no">
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex min-h-screen flex-col bg-zinc-50 text-black antialiased`}
      >
        <TooltipProvider delayDuration={400}>
          {draftMode().isEnabled && (
            <a
              className="fixed bottom-0 right-0 m-4 bg-blue-500 p-4 text-white"
              href="/api/draft-mode/disable"
            >
              Disable preview mode
            </a>
          )}
          <Nav />
          <div className="flex-1">{children}</div>
          <Footer />
          {draftMode().isEnabled ? <LiveVisualEditing /> : null}
        </TooltipProvider>
        <JsonLd jsonLd={jsonLd} />
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
