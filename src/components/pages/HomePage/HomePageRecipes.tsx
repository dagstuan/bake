import { RecipesGridElement } from "@/components/RecipesGrid/RecipesGridElement";
import { RecipesGridWrapper } from "@/components/RecipesGrid/RecipesGridWrapper";
import { Home, HomePageQueryResult } from "../../../../sanity.types";
import { OptimisticSortOrder } from "@/components/OptimisticSortOrder/OptimisticSortOrder";
import { createPath } from "@/utils/pathUtils";
import { createDataAttribute } from "next-sanity";

interface HomePageRecipesProps {
  documentId: string | undefined;
  documentType: string | undefined;
  recipes: NonNullable<HomePageQueryResult>["recipes"] | undefined;
}

export const HomePageRecipes = (props: HomePageRecipesProps) => {
  const { documentId, documentType, recipes } = props;

  if (!documentId || !documentType || !recipes) {
    return null;
  }

  const path = createPath<Home>("recipes");

  const dataAttribute = createDataAttribute({
    id: documentId,
    type: documentType,
    path,
  });

  return (
    <RecipesGridWrapper data-sanity={dataAttribute.toString()}>
      <OptimisticSortOrder id={documentId} path={path}>
        {recipes.map((recipe, i) => {
          return (
            <RecipesGridElement
              data-sanity={dataAttribute(`[_key=="${recipe._key}"]`).toString()}
              key={recipe._key}
              recipe={recipe}
              priority={i < 3}
            />
          );
        })}
      </OptimisticSortOrder>
    </RecipesGridWrapper>
  );
};
