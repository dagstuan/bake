import { AboutPage } from "@/components/pages/AboutPage/AboutPage";
import { sanityFetch } from "@/sanity/lib/live";
import { aboutQuery } from "@/sanity/lib/queries";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Om bakdel",
};

export default async function Page() {
  const initial = await sanityFetch({ query: aboutQuery });

  return <AboutPage data={initial.data} />;
}
