import { HomePage } from "@/components/pages/HomePage/HomePage";
import { HomePagePreview } from "@/components/pages/HomePage/HomePagePreview";
import { homePageQuery } from "@/sanity/lib/queries";
import { loadQuery } from "@/sanity/loader/loadQuery";
import { draftMode } from "next/headers";

export default async function Home() {
  const initial = await loadQuery(homePageQuery);

  if (draftMode().isEnabled) {
    return <HomePagePreview initial={initial} />;
  }

  return <HomePage data={initial.data} />;
}
