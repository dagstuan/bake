import { Footer } from "@/components/Footer/Footer";
import { JsonLd } from "@/components/JsonLd/JsonLd";
import { Nav } from "@/components/Nav/Nav";
import { sanityFetch } from "@/sanity/lib/live";
import { homeSeoQuery } from "@/sanity/lib/queries";
import { urlForImage } from "@/sanity/lib/utils";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import dynamic from "next/dynamic";
import localFont from "next/font/local";
import { draftMode } from "next/headers";
import { SearchAction, WebSite, WithContext } from "schema-dts";
import "../globals.css";
import {
  openGraphMetadata,
  siteName,
  siteUrl,
  twitterMetadata,
} from "../shared-metadata";

const DisableDraftMode = dynamic(() =>
  import("@/components/DisableDraftMode").then((mod) => mod.DisableDraftMode),
);

const SanityLive = dynamic(() =>
  import("@/sanity/lib/live").then((mod) => mod.SanityLive),
);

const VisualEditing = dynamic(() =>
  import("next-sanity").then((mod) => mod.VisualEditing),
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
  const { data: homeSeo } = await sanityFetch({
    query: homeSeoQuery,
    stega: false,
  });

  const metaDescription = homeSeo?.seo?.metaDescription ?? "";

  const imageWidth = 800;
  const imageHeight = 600;

  const imageUrl = homeSeo?.seo?.openGraphImage
    ? (urlForImage(homeSeo.seo.openGraphImage)
        ?.width(imageWidth)
        .height(imageHeight)
        .fit("max")
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
  const { data: homeSeo } = await sanityFetch({
    query: homeSeoQuery,
    stega: false,
  });

  const jsonLd: WithContext<WebSite> = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Bakdel",
    description: homeSeo?.seo?.metaDescription ?? "",
    url: siteUrl,
    potentialAction: searchAction,
  };

  const draftModeEnabled = (await draftMode()).isEnabled;

  return (
    <html lang="no" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-background text-foreground flex min-h-screen flex-col antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Nav />
          <div className="flex-1">{children}</div>
          <Footer />
        </ThemeProvider>

        <JsonLd jsonLd={jsonLd} />
        <SanityLive />
        {draftModeEnabled && (
          <>
            <DisableDraftMode />
            <VisualEditing />
          </>
        )}
      </body>
    </html>
  );
}
