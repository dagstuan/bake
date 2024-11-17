"use client";

import { RecipeQueryResult } from "../../../sanity.types";
import { Button } from "../ui/button";
import { TypographyP } from "../Typography/TypographyP";
import { WakeLockToggle } from "./WakeLockToggle";
import { useRecipeContext } from "./recipeContext";
import { RecipeIngredientReferenceResult } from "./RecipeIngredientReference";
import {
  RecipeIngredientReference,
  ScalableRecipeNumber as ScalableRecipeNumberType,
} from "./types";
import { ComponentProps, Fragment } from "react";
import { PortableText } from "../PortableText/PortableText";
import { formatAmount } from "@/utils/recipeUtils";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { ScalableRecipeNumber } from "./ScalableRecipeNumber";
import { TypographyH3 } from "../Typography/TypographyH3";
import { TypographyLink } from "../Typography/TypographyLink";
import { IngredientsTable } from "./IngredientsTable";
import { TypographyH4 } from "../Typography/TypographyH4";
import { TypographyH2 } from "../Typography/TypographyH2";
import {
  recipeIngredientReferenceTypeName,
  scalableRecipeNumberTypeName,
} from "@/sanity/schemaTypes/recipe/constants";
import dynamic from "next/dynamic";
import { RecipeHeader } from "./Header/RecipeHeader";
import { InfoItems } from "./InfoItems";
import { calcInitialState } from "./reducer/initialState";

const RecipeEditor = dynamic(() =>
  import("./Editor/RecipeEditor").then((mod) => mod.RecipeEditor),
);

const types: ComponentProps<typeof PortableText>["types"] = {
  [recipeIngredientReferenceTypeName]: ({
    value,
  }: {
    value: RecipeIngredientReference | null | undefined;
  }) => {
    if (!value) return null;

    return <RecipeIngredientReferenceResult value={value} />;
  },
  [scalableRecipeNumberTypeName]: ({
    value,
  }: {
    value: ScalableRecipeNumberType | null | undefined;
  }) => {
    if (!value) return null;

    return <ScalableRecipeNumber value={value} />;
  },
};

const block: ComponentProps<typeof PortableText>["block"] = {
  normal: ({ children }) => (
    <TypographyP className="leading-[1.85rem]">{children}</TypographyP>
  ),
};

type RecipeContentProps = {
  recipe: NonNullable<RecipeQueryResult>;
};

export const RecipeContent = ({ recipe }: RecipeContentProps) => {
  const { title, mainImage, instructions, activeTime, totalTime } = recipe;

  const {
    ingredients,
    ingredientsGroupOrder,
    servings,
    initialServings,
    dispatch,
  } = useRecipeContext();

  const reset = () => {
    dispatch({
      type: "reset",
      payload: calcInitialState(recipe),
    });
  };

  const scaleFactor = 100 * (servings / initialServings);

  return (
    <main className="px-6">
      <div className="prose-lg prose container mx-auto flex max-w-5xl flex-col gap-8 pt-10 sm:pt-16">
        <RecipeHeader title={title} mainImage={mainImage} />
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-8">
          <div className="col-span-full flex flex-col gap-6 md:col-span-4 md:gap-8">
            <div className="flex flex-col gap-6 rounded-lg bg-primary/5 p-4">
              <div className="flex flex-col gap-2">
                <div className="flex flex-wrap gap-2">
                  <RecipeEditor onReset={reset} triggerClassName="flex-1" />
                  <Button
                    className="flex-1"
                    type="button"
                    variant="outline"
                    onClick={reset}
                  >
                    Tilbakestill
                  </Button>
                </div>

                <WakeLockToggle />
              </div>

              <InfoItems
                servings={servings}
                activeTime={activeTime}
                totalTime={totalTime}
              />
            </div>

            <div className="flex flex-col gap-2 rounded-lg bg-primary/5 p-4">
              <TypographyH3 as="h2">Ingredienser</TypographyH3>

              <IngredientsTable
                group={null}
                ingredients={ingredients.filter((i) => !i.group)}
              />

              {ingredientsGroupOrder.map((group) => {
                const groupIngredients = ingredients.filter(
                  (i) => i.group === group,
                );

                if (groupIngredients.length === 0) return null;

                return (
                  <Fragment key={group}>
                    <TypographyH4 as="h3">{group}</TypographyH4>
                    <IngredientsTable
                      group={group}
                      ingredients={groupIngredients}
                    />
                  </Fragment>
                );
              })}
            </div>
          </div>
          <div className="col-span-full align-baseline md:col-span-8">
            <TypographyH2>Fremgangsmåte</TypographyH2>

            {parseFloat(scaleFactor.toFixed(2)) !== 100 && (
              <Alert className="my-4">
                <InfoCircledIcon />
                <AlertTitle>Skalert oppskrift</AlertTitle>
                <AlertDescription>
                  Denne oppskriften er skalert{" "}
                  {scaleFactor > 100 ? "opp til" : "ned til"}{" "}
                  {formatAmount(scaleFactor, "%", "0")} av original oppskrift.{" "}
                  <TypographyLink
                    type="external"
                    href="mailto:d.stuan@gmail.com"
                  >
                    Ta kontakt
                  </TypographyLink>{" "}
                  hvis den skalerte oppskriften ikke gir mening eller noen av
                  ingrediensene ikke blir riktig skalert.
                </AlertDescription>
              </Alert>
            )}

            {instructions ? (
              <PortableText value={instructions} block={block} types={types} />
            ) : null}
          </div>
        </div>
      </div>
    </main>
  );
};
