import { RecipesGridSkeleton } from "@/components/RecipesGrid/RecipesGridSkeleton";
import {
  categoryQueryParam,
  RecipesFilters,
  searchQueryParam,
} from "@/components/RecipesPage/RecipesFilters";
import { RecipesPageContentWrapper } from "@/components/RecipesPage/RecipesPageContentWrapper";
import { TypographyH1 } from "@/components/Typography/TypographyH1";
import { sanityFetch } from "@/sanity/lib/live";
import { allCategoriesQuery } from "@/sanity/lib/queries";
import { Metadata } from "next/types";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Alle oppskrifter",
};

export default async function Page(props: {
  searchParams?: Promise<{
    [searchQueryParam]?: string;
    [categoryQueryParam]?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query;
  const category = searchParams?.category;

  const { data: categories } = await sanityFetch({ query: allCategoriesQuery });

  return (
    <div className="px-6">
      <div className="mx-auto mt-8 flex max-w-6xl flex-1 flex-col justify-center gap-12 sm:mt-16">
        <TypographyH1 className="mx-auto">Alle oppskrifter</TypographyH1>

        <RecipesFilters categories={categories} />

        <Suspense
          key={`${query}-${category}`}
          fallback={<RecipesGridSkeleton />}
        >
          <RecipesPageContentWrapper query={query} category={category} />
        </Suspense>
      </div>
    </div>
  );
}
