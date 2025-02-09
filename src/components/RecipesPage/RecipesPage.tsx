import { Nullable } from "@/utils/types";
import { Suspense } from "react";
import { TypographyH1 } from "../Typography/TypographyH1";
import { RecipesPageGrid } from "./Grid/RecipesPageGrid";
import { RecipesPageGridSkeleton } from "./Grid/RecipesPageGridSkeleton";
import { TransitionContextProvider } from "./TransitionContext";
import { RecipesFiltersSkeleton } from "./Filters/RecipesFiltersSkeleton";
import { RecipesFilters } from "./Filters/RecipesFilters";

export interface RecipesGridWrapperProps {
  query: Nullable<string>;
  category: Nullable<string>;
}

export const RecipesPage = ({ query, category }: RecipesGridWrapperProps) => {
  return (
    <TransitionContextProvider>
      <div className="px-6">
        <div className="mx-auto mt-8 flex max-w-6xl flex-1 flex-col justify-center gap-12 sm:mt-16">
          <TypographyH1 className="mx-auto">Alle oppskrifter</TypographyH1>

          <Suspense fallback={<RecipesFiltersSkeleton />}>
            <RecipesFilters />
          </Suspense>

          <Suspense fallback={<RecipesPageGridSkeleton />}>
            <RecipesPageGrid
              key={`${query}-${category}`}
              query={query}
              category={category}
            />
          </Suspense>
        </div>
      </div>
    </TransitionContextProvider>
  );
};
