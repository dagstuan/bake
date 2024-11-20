"use client";

import { TypographyH1 } from "@/components/Typography/TypographyH1";
import { TypographyH2 } from "@/components/Typography/TypographyH2";
import { TypographyLink } from "@/components/Typography/TypographyLink";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { Home, HomePageQueryResult } from "../../../../sanity.types";
import { useOptimistic } from "next-sanity/hooks";
import { SanityDocument } from "next-sanity";
import { createTypedDataAttribute } from "@/sanity/utils";
import { RecipesGridWrapper } from "@/components/RecipesGrid/RecipesGridWrapper";
import { RecipesGridElement } from "@/components/RecipesGrid/RecipesGridElement";

type HomePageProps = {
  data: HomePageQueryResult;
};

const isHomePage = (data: SanityDocument): data is Home => {
  return data._type === "home" && (data as Home).recipes !== undefined;
};

export const HomePage = (props: HomePageProps) => {
  const { _id, _type, subtitle, recipes: initialRecipes } = props.data ?? {};

  const recipes = useOptimistic(initialRecipes, (currentRecipes, action) => {
    const document = action.document;
    if (
      action.id === _id &&
      action.type === "mutate" &&
      isHomePage(document) &&
      document.recipes
    ) {
      return document.recipes
        .map((recipe) => currentRecipes?.find((r) => r._key === recipe?._key))
        .filter((r) => r !== undefined);
    }

    return currentRecipes;
  });

  return (
    <main className="sm:mt-35 mt-8 flex flex-col gap-10 px-6 sm:mt-16 sm:items-center sm:gap-16">
      <div className="flex max-w-3xl flex-col gap-3 sm:text-center">
        <TypographyH1>
          Bak<span className="text-4xl font-extralight text-gray-400">&</span>
          del 🧑‍🍳
        </TypographyH1>
        <p className="text-2xl">{subtitle}</p>
      </div>

      <div className="w-full max-w-6xl">
        <TypographyH2>Oppskrifter</TypographyH2>

        <div className="flex flex-col gap-4">
          <RecipesGridWrapper
            data-sanity={createTypedDataAttribute<Home>(_id, _type, "recipes")}
          >
            {recipes?.map((recipe, i) => {
              return (
                <RecipesGridElement
                  data-sanity={createTypedDataAttribute<Home>(
                    _id,
                    _type,
                    `recipes[_key=="${recipe._key}"]`,
                  )}
                  key={recipe._key}
                  recipe={recipe}
                  prority={i < 3}
                />
              );
            })}
          </RecipesGridWrapper>

          <TypographyLink
            href="/oppskrifter"
            type="internal"
            className="flex items-center gap-1 self-end"
          >
            Se alle oppskrifter <ArrowRightIcon />
          </TypographyLink>
        </div>
      </div>
    </main>
  );
};
