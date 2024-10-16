import { RecipesGridSkeleton } from "@/components/RecipesGrid/RecipesGridSkeleton";
import {
  categoryQueryParam,
  RecipesFilters,
  searchQueryParam,
} from "@/components/RecipesPage/RecipesFilters";
import { RecipesPageContent } from "@/components/RecipesPage/RecipesPageContent";
import { TypographyH1 } from "@/components/Typography/TypographyH1";
import { allCategoriesQuery } from "@/sanity/lib/queries";
import { loadQuery } from "@/sanity/loader/loadQuery";
import { Metadata } from "next/types";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Alle oppskrifter",
};

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    [searchQueryParam]?: string;
    [categoryQueryParam]?: string;
  };
}) {
  const query = searchParams?.query;
  const categoryQuery = searchParams?.category;

  const { data: categories } = await loadQuery(allCategoriesQuery);

  return (
    <div className="px-6">
      <div className="mx-auto mt-8 flex max-w-6xl flex-1 flex-col justify-center gap-12 sm:mt-16">
        <TypographyH1 className="mx-auto">Alle oppskrifter</TypographyH1>

        <RecipesFilters categories={categories} />

        <Suspense key={query} fallback={<RecipesGridSkeleton />}>
          <RecipesPageContent query={query} category={categoryQuery} />
        </Suspense>
      </div>
    </div>
  );
}
