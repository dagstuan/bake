import { sanityFetch } from "@/sanity/lib/live";
import { allCategoriesQuery } from "@/sanity/lib/queries";
import { RecipesFiltersContent } from "./RecipesFiltersContent";

export const RecipesFilters = async () => {
  "use cache";

  const { data: categories } = await sanityFetch({
    query: allCategoriesQuery,
    perspective: "published",
    stega: false,
  });

  return <RecipesFiltersContent categories={categories} />;
};
