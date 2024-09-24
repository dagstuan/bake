import { Recipes } from "@/components/Recipes/Recipes";
import { sanityFetch } from "@/sanity/lib/client";
import { allRecipesQuery } from "@/sanity/lib/queries";

export default async function Home() {
  const recipes = await sanityFetch({
    query: allRecipesQuery,
  });

  return <Recipes recipes={recipes} />;
}
