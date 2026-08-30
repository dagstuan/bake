import { RecipeQueryResult } from "../../../sanity.types";
import { RecipeContent } from "./RecipeContent";
import { notFound } from "next/navigation";
import { RecipeContextProvider } from "./recipeContext";
import { ViewTransition } from "react";
import type { StegaAware } from "@/sanity/lib/live";

interface RecipeProps {
  recipe: StegaAware<RecipeQueryResult>;
  slug: string;
}

export const Recipe = ({ recipe, slug }: RecipeProps) => {
  if (!recipe) {
    return notFound();
  }

  return (
    <ViewTransition>
      <RecipeContextProvider recipe={recipe}>
        <RecipeContent recipe={recipe} slug={slug} />
      </RecipeContextProvider>
    </ViewTransition>
  );
};
