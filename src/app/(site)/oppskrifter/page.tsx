import { RecipesPage } from "@/components/RecipesPage/RecipesPage";
import { RecipesPageSearchParams } from "@/components/RecipesPage/types";
import { Metadata } from "next/types";

export const experimental_ppr = true;

export const metadata: Metadata = {
  title: "Alle oppskrifter",
};

export default function Page(props: {
  searchParams: Promise<RecipesPageSearchParams>;
}) {
  return <RecipesPage searchParams={props.searchParams} />;
}
