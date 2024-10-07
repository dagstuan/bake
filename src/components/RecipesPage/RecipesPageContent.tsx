import { sanityFetch } from "@/sanity/lib/client";
import {
  allRecipesQuery,
  recipesSearchQuery,
  recipesSearchWithCategoriesQuery,
} from "@/sanity/lib/queries";
import { RecipesGrid } from "../RecipesGrid/RecipesGrid";
import { RecipesSearchQueryResult } from "../../../sanity.types";
import { Nullable } from "@/utils/types";

type RecipesPageContentProps = {
  query: Nullable<string>;
  categories: Nullable<Array<string>>;
};

const fetchRecipes = async (
  searchQuery: Nullable<string>,
  categories: Nullable<Array<string>>,
): Promise<RecipesSearchQueryResult> => {
  if (searchQuery || categories) {
    return await sanityFetch({
      query:
        (categories?.length ?? 0) > 0
          ? recipesSearchWithCategoriesQuery
          : recipesSearchQuery,
      params: {
        searchQuery: searchQuery ? `*${searchQuery}*` : "*",
        categories: categories ? categories : [],
      },
    });
  }

  return await sanityFetch({
    query: allRecipesQuery,
  });
};

export const RecipesPageContent = async ({
  query,
  categories,
}: RecipesPageContentProps) => {
  const recipes = await fetchRecipes(query, categories);

  return <RecipesGrid recipes={recipes} />;
};
