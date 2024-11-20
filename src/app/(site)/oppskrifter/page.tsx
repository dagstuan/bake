import { fetchRecipes } from "@/components/RecipesPage/fetchRecipes";
import {
  categoryQueryParam,
  searchQueryParam,
} from "@/components/RecipesPage/RecipesFilters";
import { RecipesPageContent } from "@/components/RecipesPage/RecipesPageContent";
import { amountPerFetch } from "@/components/RecipesPage/utils";
import { sanityFetch } from "@/sanity/lib/live";
import { allCategoriesQuery } from "@/sanity/lib/queries";
import { Metadata } from "next/types";

export const metadata: Metadata = {
  title: "Alle oppskrifter",
};

export default async function Page(props: {
  searchParams?: Promise<{
    [searchQueryParam]?: string;
    [categoryQueryParam]?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query;
  const category = searchParams?.category;

  const [{ data: categories }, recipes] = await Promise.all([
    sanityFetch({ query: allCategoriesQuery }),
    fetchRecipes(query, category, amountPerFetch),
  ]);

  return (
    <RecipesPageContent
      categories={categories}
      recipes={recipes}
      query={query}
      category={category}
    />
  );
}
