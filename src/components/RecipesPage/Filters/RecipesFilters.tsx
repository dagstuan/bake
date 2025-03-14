import { sanityFetch } from "@/sanity/lib/live";
import { allCategoriesQuery } from "@/sanity/lib/queries";
import { RecipesFiltersContent } from "./RecipesFiltersContent";

export const RecipesFilters = async () => {
  const { data: categories } = await sanityFetch({ query: allCategoriesQuery });

  return <RecipesFiltersContent categories={categories} />;
};
