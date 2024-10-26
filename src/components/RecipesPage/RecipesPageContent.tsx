import {
  allRecipesQuery,
  recipesSearchQuery,
  recipesSearchWithCategoriesQuery,
} from "@/sanity/lib/queries";
import { RecipesGrid } from "../RecipesGrid/RecipesGrid";
import { RecipesSearchQueryResult } from "../../../sanity.types";
import { Nullable } from "@/utils/types";
import { sanityFetch } from "@/sanity/lib/live";

type RecipesPageContentProps = {
  query: Nullable<string>;
  category: Nullable<string>;
};

const fetchRecipes = async (
  searchQuery: Nullable<string>,
  category: Nullable<string>,
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
      },
    });

    return recipes;
  }

  const { data: recipes } = await sanityFetch({ query: allRecipesQuery });
  return recipes;
};

export const RecipesPageContent = async ({
  query,
  category,
}: RecipesPageContentProps) => {
  const recipes = await fetchRecipes(query, category);

  return <RecipesGrid recipes={recipes} />;
};
