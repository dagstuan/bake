"use client";

import { Nullable } from "@/utils/types";
import { RecipesPageGrid } from "./RecipesPageGrid";
import {
  AllCategoriesQueryResult,
  RecipesListQueryResult,
} from "../../../sanity.types";
import { RecipesFilters } from "./RecipesFilters";
import { useTransition } from "react";
import { TypographyH1 } from "../Typography/TypographyH1";

export type RecipesGridWrapperProps = {
  categories: AllCategoriesQueryResult;
  recipes: RecipesListQueryResult;
  query: Nullable<string>;
  category: Nullable<string>;
};

export const RecipesPageContent = ({
  categories,
  recipes,
  query,
  category,
}: RecipesGridWrapperProps) => {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="px-6">
      <div className="mx-auto mt-8 flex max-w-6xl flex-1 flex-col justify-center gap-12 sm:mt-16">
        <TypographyH1 className="mx-auto">Alle oppskrifter</TypographyH1>

        <RecipesFilters
          startTransition={startTransition}
          categories={categories}
        />

        <RecipesPageGrid
          key={`${query}-${category}`}
          recipes={recipes}
          query={query}
          category={category}
          isTransitionPending={isPending}
        />
      </div>
    </div>
  );
};
