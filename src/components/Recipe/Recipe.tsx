"use client";

import { RecipeQueryResult } from "../../../sanity.types";
import { RecipeContextProvider } from "./recipeContext";
import { RecipeContent } from "./RecipeContent";
import { notFound } from "next/navigation";

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
