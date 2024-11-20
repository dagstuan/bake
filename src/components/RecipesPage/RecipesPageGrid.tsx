"use client";

import { Button } from "../ui/button";
import { useState } from "react";
import { fetchRecipes } from "./fetchRecipes";
import { SpinnerIcon } from "../icons/SpinnerIcon";
import { amountPerFetch } from "./utils";
import { RecipesListQueryResult } from "../../../sanity.types";
import { Nullable } from "@/utils/types";
import { NoRecipes } from "../RecipesGrid/NoRecipes";
import { RecipesGridWrapper } from "../RecipesGrid/RecipesGridWrapper";
import { RecipesGridElement } from "../RecipesGrid/RecipesGridElement";
import { cn } from "@/lib/utils";

type RecipesPageGridProps = {
  recipes: RecipesListQueryResult;
  query: Nullable<string>;
  category: Nullable<string>;
  isTransitionPending: boolean;
};

export const RecipesPageGrid = ({
  recipes,
  query,
  category,
  isTransitionPending,
}: RecipesPageGridProps) => {
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
      {recipesList.length === 0 ? (
        <NoRecipes isTransitionPending={isTransitionPending} />
      ) : (
        <RecipesGridWrapper>
          {recipes.map((recipe, i) => {
            return (
              <RecipesGridElement
                key={recipe._id}
                recipe={recipe}
                prority={i < 3}
                className={cn({
                  ["opacity-60"]: isTransitionPending,
                })}
              />
            );
          })}
        </RecipesGridWrapper>
      )}

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
