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

export const metadata: Metadata = {
  title: {
    default: "Bakdel",
    template: "%s | Bakdel",
  },
  description: "Lettleste, skalerbare oppskrifter",
  openGraph: {
    locale: "no_NO",
    type: "website",
    url: "https://www.bakdel.no",
    siteName: "Bakdel",
    title: "Bakdel",
    description: "Lettleste, skalerbare oppskrifter",
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
