import { Suspense, ViewTransition } from "react";
import { TypographyH1 } from "../Typography/TypographyH1";
import { RecipesPageGrid } from "./Grid/RecipesPageGrid";
import { TransitionContextProvider } from "./TransitionContext";
import { RecipesFiltersSkeleton } from "./Filters/RecipesFiltersSkeleton";
import { RecipesFilters } from "./Filters/RecipesFilters";
import { RecipesPageSearchParams } from "./types";

export interface RecipesGridWrapperProps {
  searchParams: Promise<RecipesPageSearchParams>;
}

export const RecipesPage = ({ searchParams }: RecipesGridWrapperProps) => {
  return (
    <TransitionContextProvider>
      <main className="px-6">
        <div className="mx-auto mt-8 flex max-w-6xl flex-1 flex-col justify-center gap-12 sm:mt-16">
          <TypographyH1 className="mx-auto">Alle oppskrifter</TypographyH1>

          <Suspense fallback={<RecipesFiltersSkeleton />}>
            <RecipesFilters />
          </Suspense>

          <ViewTransition>
            <RecipesPageGrid searchParams={searchParams} />
          </ViewTransition>
        </div>
      </main>
    </TransitionContextProvider>
  );
};
