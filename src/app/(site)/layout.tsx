import { Analytics } from "@vercel/analytics/react";
import { VisualEditing } from "next-sanity";
import { draftMode } from "next/headers";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Nav } from "@/components/Nav/Nav";
import { Footer } from "@/components/Footer/Footer";
import { TooltipProvider } from "@/components/ui/tooltip";

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

const metaDescription =
  "Bakdel er en side som gir deg lettleste og skalerbare bake- og matoppskrifter uten reklame.";

export const metadata: Metadata = {
  title: {
    default: "Bakdel",
    template: "%s | Bakdel",
  },
  keywords: [
    "bake",
    "mat",
    "oppskrifter",
    "bakeoppskrifter",
    "matoppskrifter",
    "skalere",
    "skalerbare",
  ],
  description: metaDescription,
  openGraph: {
    locale: "no_NO",
    type: "website",
    url: "https://www.bakdel.no",
    siteName: "Bakdel",
    title: "Bakdel",
    description: metaDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: "Bakdel",
    creator: "Dag Stuan",
    description: metaDescription,
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
  appleWebApp: {
    title: "Bakdel",
    statusBarStyle: "default",
    capable: true,
  },
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🍞</text></svg>",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
          {draftMode().isEnabled && <VisualEditing />}
          <Analytics />
        </TooltipProvider>
      </body>
    </html>
  );
}
