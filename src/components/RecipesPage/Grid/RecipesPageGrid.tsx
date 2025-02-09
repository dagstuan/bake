import { Nullable } from "@/utils/types";
import { fetchRecipes } from "../fetchRecipes";
import { RecipesPageGridContent } from "./RecipesPageGridContent";
import { amountPerFetch } from "../utils";

interface RecipesPageGridProps {
  query: Nullable<string>;
  category: Nullable<string>;
}

export const RecipesPageGrid = async (props: RecipesPageGridProps) => {
  const { query, category } = props;

  const recipes = await fetchRecipes(query, category, amountPerFetch);

  return (
    <RecipesPageGridContent
      recipes={recipes}
      query={query}
      category={category}
    />
  );
};
