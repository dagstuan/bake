"use client";

import { RecipeQueryResult } from "../../../sanity.types";
import { TypographyH1 } from "../Typography/TypographyH1";
import { Button } from "../ui/button";
import { TypographyP } from "../Typography/TypographyP";
import { WakeLockToggle } from "./WakeLockToggle";
import { RecipeEditor } from "./RecipeEditor";
import { useRecipeContext } from "./recipeContext";
import { calcInitialState } from "./recipeReducer";
import { RecipeIngredientReferenceResult } from "./RecipeIngredientReference";
import { recipeIngredientReferenceType } from "@/sanity/schemaTypes/recipe/recipeIngredientReference";
import {
  RecipeIngredientReference,
  ScalableRecipeNumber as ScalableRecipeNumberType,
} from "./types";
import { ComponentProps, Fragment } from "react";
import { PortableText } from "../PortableText/PortableText";
import { formatAmount } from "@/utils/recipeUtils";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { ClockIcon, InfoCircledIcon } from "@radix-ui/react-icons";
import { scalableRecipeNumberType } from "@/sanity/schemaTypes/recipe/scalableRecipeNumberType";
import { ScalableRecipeNumber } from "./ScalableRecipeNumber";
import { Duration } from "./Duration";
import { CookingPotIcon } from "../icons/CookingPotIcon";
import { CakeSliceIcon } from "../icons/CakeSliceIcon";
import { Badge } from "../ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { TypographyH3 } from "../Typography/TypographyH3";
import { urlForImage } from "@/sanity/lib/utils";
import { Image } from "../Image/Image";
import { TypographyLink } from "../Typography/TypographyLink";
import { IngredientsTable } from "./IngredientsTable";
import { TypographyH4 } from "../Typography/TypographyH4";

const types: ComponentProps<typeof PortableText>["types"] = {
  [recipeIngredientReferenceType.name]: ({
    value,
  }: {
    value: RecipeIngredientReference | null | undefined;
  }) => {
    if (!value) return null;

    return <RecipeIngredientReferenceResult value={value} />;
  },
  [scalableRecipeNumberType.name]: ({
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
        {title ? (
          <TypographyH1 className="text-center sm:mb-8">{title}</TypographyH1>
        ) : null}
        {mainImage && (
          <Image
            className="w-full rounded-lg"
            src={
              urlForImage(mainImage)?.width(1200).height(500).dpr(2).url() ?? ""
            }
            width={1200}
            height={500}
            alt={mainImage.alt ?? title ?? "Recipe"}
            priority
            blurDataURL={mainImage?.asset?.metadata?.lqip ?? undefined}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw"
          />
        )}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-8">
          <div className="col-span-full flex flex-col gap-6 md:col-span-4 md:gap-8">
            <div className="flex flex-col gap-4">
              <WakeLockToggle />

              <div className="flex flex-wrap gap-2">
                <RecipeEditor onReset={reset} />
                <Button type="button" variant="outline" onClick={reset}>
                  Tilbakestill
                </Button>
              </div>

              <div className="flex flex-col flex-wrap items-start gap-2">
                <Tooltip>
                  <TooltipTrigger>
                    <Badge
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <CakeSliceIcon />
                      Antall: {formatAmount(servings)}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    Antall porsjoner du får.
                  </TooltipContent>
                </Tooltip>

                {activeTime && (
                  <Duration
                    duration={activeTime}
                    icon={<CookingPotIcon />}
                    title="Aktiv tid:"
                    tooltip="Aktiv tidsbruk som kreves for å lage oppskriften."
                  />
                )}

                {totalTime && (
                  <Duration
                    duration={totalTime}
                    icon={<ClockIcon />}
                    title="Total tid:"
                    tooltip="Total tidsbruk fra du starter til retten er ferdig."
                  />
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2">
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
            {scaleFactor !== 100 && (
              <Alert>
                <InfoCircledIcon />
                <AlertTitle>Skalert oppskrift</AlertTitle>
                <AlertDescription>
                  Denne oppskriften er skalert{" "}
                  {scaleFactor > 100 ? "opp til" : "ned til"}{" "}
                  {formatAmount(scaleFactor, 0)}% av original oppskrift.{" "}
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
