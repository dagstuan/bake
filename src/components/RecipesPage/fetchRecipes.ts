"use server";

import {
  allRecipesQuery,
  recipesSearchQuery,
  recipesSearchWithCategoriesQuery,
} from "@/sanity/lib/queries";
import { RecipesSearchQueryResult } from "../../../sanity.types";
import { Nullable } from "@/utils/types";
import { sanityFetch } from "@/sanity/lib/live";

export const fetchRecipes = async (
  searchQuery: Nullable<string>,
  category: Nullable<string>,
  amount: number,
  lastId: Nullable<string> = null,
  lastCreatedAt: Nullable<string> = null,
): Promise<RecipesSearchQueryResult> => {
  if (searchQuery || category) {
    const { data: recipes } = await sanityFetch({
      query:
        (category?.length ?? 0) > 0
          ? recipesSearchWithCategoriesQuery
          : recipesSearchQuery,
      params: {
        searchQuery: searchQuery ? `*${searchQuery}*` : "*",
        categories: category ? [category] : [],
        lastId,
        lastCreatedAt,
        amount,
      },
    });

    return recipes;
  }

  const { data: recipes } = await sanityFetch({
    query: allRecipesQuery,
    params: {
      lastId,
      lastCreatedAt,
      amount,
    },
  });

  return recipes;
};
