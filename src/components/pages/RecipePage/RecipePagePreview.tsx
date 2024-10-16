"use client";

import { recipeQuery } from "@/sanity/lib/queries";
import { LoadQueryResult } from "@/sanity/loader/loadQuery";
import { RecipePage } from "./RecipePage";
import { useQuery } from "@/sanity/loader/useQuery";

type RecipePagePreviewProps = {
  initial: LoadQueryResult<typeof recipeQuery>;
  params: { slug: string };
};

export const RecipePagePreview = (props: RecipePagePreviewProps) => {
  const { params, initial } = props;
  const { data } = useQuery(recipeQuery, { slug: params.slug }, { initial });

  return <RecipePage data={data} params={params} />;
};
