import { AboutPage } from "@/components/pages/AboutPage/AboutPage";
import { AboutPagePreview } from "@/components/pages/AboutPage/AboutPagePreview";
import { aboutQuery } from "@/sanity/lib/queries";
import { loadQuery } from "@/sanity/loader/loadQuery";
import { Metadata } from "next";
import { draftMode } from "next/headers";

export const metadata: Metadata = {
  title: "Om bakdel",
};

export default async function Page() {
  const initial = await loadQuery(aboutQuery);

  if (draftMode().isEnabled) {
    return <AboutPagePreview initial={initial} />;
  }

  return <AboutPage data={initial.data} />;
}
