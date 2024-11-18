"use client";

import { RecipesGrid } from "../RecipesGrid/RecipesGrid";
import { Button } from "../ui/button";
import { useState } from "react";
import { fetchRecipes } from "./fetchRecipes";
import { SpinnerIcon } from "../icons/SpinnerIcon";
import { amountPerFetch } from "./utils";
import { RecipesGridWrapperProps } from "./RecipesPageContentWrapper";
import { RecipesListQueryResult } from "../../../sanity.types";

type RecipesPageContentProps = {
  recipes: RecipesListQueryResult;
} & RecipesGridWrapperProps;

export const RecipesPageContent = ({
  recipes,
  query,
  category,
}: RecipesPageContentProps) => {
  const [recipesList, setRecipesList] = useState<
    NonNullable<RecipesListQueryResult>
  >(recipes ?? []);
  const [hasMore, setHasMore] = useState(recipesList.length >= amountPerFetch);
  const [isLoading, setIsLoading] = useState(false);

  const fetchMore = async () => {
    setIsLoading(true);
    try {
      const lastRecipe = recipesList[recipesList.length - 1];
      const newRecipes = await fetchRecipes(
        query,
        category,
        amountPerFetch,
        lastRecipe._id,
        lastRecipe._createdAt,
      );

      if (newRecipes.length < amountPerFetch) {
        setHasMore(false);
      }
      setRecipesList([...recipesList, ...newRecipes]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-10">
      <RecipesGrid recipes={recipesList} />

      {hasMore ? (
        <Button
          className="mx-auto max-w-max"
          disabled={isLoading}
          onClick={fetchMore}
        >
          {isLoading ? (
            <>
              <SpinnerIcon className="h-5 w-5 animate-spin" /> Laster...
            </>
          ) : (
            "Hent flere oppskrifter"
          )}
        </Button>
      ) : recipesList.length > 0 ? (
        <p className="mx-auto flex h-9 items-center text-muted-foreground">
          Ingen flere oppskrifter.
        </p>
      ) : null}
    </div>
  );
};
