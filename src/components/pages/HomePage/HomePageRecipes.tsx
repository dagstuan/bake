"use client";

import { RecipesGridElement } from "@/components/RecipesGrid/RecipesGridElement";
import { RecipesGridWrapper } from "@/components/RecipesGrid/RecipesGridWrapper";
import { createTypedDataAttribute } from "@/sanity/utils";
import { Home, HomePageQueryResult } from "../../../../sanity.types";
import { useOptimistic } from "next-sanity/hooks";
import { SanityDocument } from "next-sanity";

const isHomePage = (data: SanityDocument): data is Home => {
  return data._type === "home" && (data as Home).recipes !== undefined;
};

interface HomePageRecipesProps {
  documentId: string | undefined;
  documentType: string | undefined;
  recipes: NonNullable<HomePageQueryResult>["recipes"] | undefined;
}

export const HomePageRecipes = (props: HomePageRecipesProps) => {
  const { documentId, documentType, recipes: initialRecipes } = props;

  const recipes = useOptimistic(initialRecipes, (currentRecipes, action) => {
    const document = action.document;
    if (
      action.id === documentId &&
      action.type === "mutate" &&
      isHomePage(document) &&
      document.recipes
    ) {
      return document.recipes
        .map((recipe) => currentRecipes?.find((r) => r._key === recipe._key))
        .filter((r) => r !== undefined);
    }

    return currentRecipes;
  });

  if (!documentId || !documentType) {
    return null;
  }

  const dataAttribute = createTypedDataAttribute<Home>({
    id: documentId,
    type: documentType,
    path: "recipes",
  });

  return (
    <RecipesGridWrapper data-sanity={dataAttribute.toString()}>
      {recipes?.map((recipe, i) => {
        return (
          <RecipesGridElement
            data-sanity={dataAttribute
              .scope(`[_key=="${recipe._key}"]`)
              .toString()}
            key={recipe._key}
            recipe={recipe}
            prority={i < 3}
          />
        );
      })}
    </RecipesGridWrapper>
  );
};
