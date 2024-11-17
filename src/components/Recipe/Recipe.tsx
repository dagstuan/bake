import { RecipeQueryResult } from "../../../sanity.types";
import { RecipeContent } from "./RecipeContent";
import { notFound } from "next/navigation";
import { RecipeContextProvider } from "./recipeContext";

type RecipeProps = {
  recipe: RecipeQueryResult;
};

export const Recipe = ({ recipe }: RecipeProps) => {
  if (!recipe) {
    return notFound();
  }

  return (
    <RecipeContextProvider recipe={recipe}>
      <RecipeContent recipe={recipe} />
    </RecipeContextProvider>
  );
};
