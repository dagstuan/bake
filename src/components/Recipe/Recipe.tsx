"use client";

import { RecipeQueryResult } from "../../../sanity.types";
import { RecipeContextProvider } from "./recipeContext";
import { RecipeContent } from "./RecipeContent";

type RecipeProps = {
  recipe: RecipeQueryResult;
};

export const Recipe = ({ recipe }: RecipeProps) => {
  return (
    <RecipeContextProvider recipe={recipe}>
      <RecipeContent recipe={recipe} />
    </RecipeContextProvider>
  );
};
