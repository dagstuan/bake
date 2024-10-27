"use server";

import { recipesListQuery } from "@/sanity/lib/queries";
import { Nullable } from "@/utils/types";
import { sanityFetch } from "@/sanity/lib/live";
import { RecipesListQueryResult } from "../../../sanity.types";

export const fetchRecipes = async (
  searchQuery: Nullable<string>,
  category: Nullable<string>,
  amount: number,
  lastId: Nullable<string> = null,
  lastCreatedAt: Nullable<string> = null,
): Promise<RecipesListQueryResult> => {
  const { data: recipes } = await sanityFetch({
    query: recipesListQuery,
    params: {
      searchQuery: searchQuery ? `*${searchQuery}*` : "*",
      categories: category ? [category] : null,
      lastId,
      lastCreatedAt,
      amount,
    },
  });

  return recipes;
};
