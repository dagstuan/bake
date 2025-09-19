import { HomePage } from "@/components/pages/HomePage/HomePage";
import { sanityFetch } from "@/sanity/lib/live";
import { homePageQuery } from "@/sanity/lib/queries";

export default async function Home() {
  const initial = await sanityFetch({ query: homePageQuery });

  return <HomePage data={initial.data} />;
}
