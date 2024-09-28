import { RecipesGrid } from "@/components/RecipesGrid/RecipesGrid";
import { TypographyH1 } from "@/components/Typography/TypographyH1";
import { sanityFetch } from "@/sanity/lib/client";
import { allRecipesQuery } from "@/sanity/lib/queries";
import { Metadata } from "next/types";

export const metadata: Metadata = {
  title: "Alle oppskrifter",
};

export default async function Home() {
  const recipes = await sanityFetch({
    query: allRecipesQuery,
  });

  return (
    <div className="mb-10 mt-8 flex justify-center">
      <div className="w-full max-w-6xl">
        <TypographyH1>Alle oppskrifter</TypographyH1>

        <RecipesGrid recipes={recipes} />
      </div>
    </div>
  );
}
