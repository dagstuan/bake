import {
  categoryQueryParam,
  searchQueryParam,
} from "@/components/RecipesPage/Filters/RecipesFiltersContent";
import { RecipesPage } from "@/components/RecipesPage/RecipesPage";
import { Metadata } from "next/types";

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

  return <RecipesPage query={query} category={category} />;
}
