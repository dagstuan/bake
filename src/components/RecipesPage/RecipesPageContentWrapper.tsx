import { Nullable } from "@/utils/types";
import { fetchRecipes } from "./fetchRecipes";
import { RecipesPageContent } from "./RecipesPageContent";
import { amountPerFetch } from "./utils";

export type RecipesGridWrapperProps = {
  query: Nullable<string>;
  category: Nullable<string>;
};

export const RecipesPageContentWrapper = async ({
  query,
  category,
}: RecipesGridWrapperProps) => {
  const recipes = await fetchRecipes(query, category, amountPerFetch);

  return (
    <RecipesPageContent recipes={recipes} query={query} category={category} />
  );
};
