import { fetchRecipes } from "../fetchRecipes";
import { RecipesPageGridContent } from "./RecipesPageGridContent";
import { amountPerFetch } from "../utils";
import { RecipesPageSearchParams } from "../types";

interface RecipesPageGridProps {
  searchParams: Promise<RecipesPageSearchParams>;
}

export const RecipesPageGrid = async (props: RecipesPageGridProps) => {
  const { query, category } = await props.searchParams;

  const recipes = await fetchRecipes(query, category, amountPerFetch);

  return (
    <RecipesPageGridContent
      key={`${query}-${category}`}
      recipes={recipes}
      query={query}
      category={category}
    />
  );
};
