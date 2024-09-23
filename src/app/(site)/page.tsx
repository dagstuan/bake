import { Recipes } from "@/components/Recipes";
import { sanityFetch } from "@/sanity/lib/client";
import { recipesQuery } from "@/sanity/lib/queries";

export default async function Home() {
  const recipes = await sanityFetch({
    query: recipesQuery,
  });

  return <Recipes recipes={recipes} />;
}
