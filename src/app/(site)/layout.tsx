import { VisualEditing } from "next-sanity";
import { draftMode } from "next/headers";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Nav } from "@/components/Nav/Nav";

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
  title: "Bake",
  description: "Lettleste, skalerbare oppskrifter",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="no">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-zinc-50 text-black antialiased`}
      >
        {draftMode().isEnabled && (
          <a
            className="fixed bottom-0 right-0 m-4 bg-blue-500 p-4 text-white"
            href="/api/draft-mode/disable"
          >
            Disable preview mode
          </a>
        )}
        <Nav />
        {children}
        {draftMode().isEnabled && <VisualEditing />}
      </body>
    </html>
  );
}
