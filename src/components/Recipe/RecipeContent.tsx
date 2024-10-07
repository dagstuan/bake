"use client";

import { RecipeQueryResult } from "../../../sanity.types";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { TypographyH1 } from "../Typography/TypographyH1";
import { Button } from "../ui/button";
import { TypographyP } from "../Typography/TypographyP";
import { WakeLockToggle } from "./WakeLockToggle";
import { RecipeEditor } from "./RecipeEditor";
import { useRecipeContext } from "./recipeContext";
import { calcInitialState, isIngredientComplete } from "./recipeReducer";
import { RecipeIngredientReferenceResult } from "./RecipeIngredientReference/RecipeIngredientReference";
import { recipeIngredientReferenceType } from "@/sanity/schemaTypes/recipeIngredientReference";
import {
  RecipeIngredientReference,
  ScalableRecipeNumber as ScalableRecipeNumberType,
} from "./types";
import { ComponentProps } from "react";
import { PortableText } from "../PortableText/PortableText";
import { formatAmount } from "@/utils/recipeUtils";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { ClockIcon, InfoCircledIcon } from "@radix-ui/react-icons";
import { scalableRecipeNumberType } from "@/sanity/schemaTypes/scalableRecipeNumberType";
import { ScalableRecipeNumber } from "./ScalableRecipeNumber";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { Duration } from "./Duration";
import { CookingPotIcon } from "../icons/CookingPotIcon";
import { CakeSliceIcon } from "../icons/CakeSliceIcon";
import { Badge } from "../ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { TypographyH3 } from "../Typography/TypographyH3";

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
    <TypographyP className="leading-7">{children}</TypographyP>
  ),
};

type RecipeContentProps = {
  recipe: NonNullable<RecipeQueryResult>;
};

export const RecipeContent = ({ recipe }: RecipeContentProps) => {
  const { title, mainImage, instructions, activeTime, totalTime } = recipe;

  const {
    ingredients,
    ingredientsCompletion,
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

  const ingredientsCompletionValues = Object.values(ingredientsCompletion);

  const anyIngredientsComplete = ingredientsCompletionValues.some((c) =>
    Object.values(c).some((c) => c.completed),
  );

  const allIngredientsComplete = ingredientsCompletionValues.every((c) =>
    Object.values(c).every((c) => c.completed),
  );

  return (
    <main className="px-6">
      <div className="prose-lg prose container mx-auto flex max-w-5xl flex-col gap-8 pt-10 sm:pt-16">
        {title ? (
          <TypographyH1 className="text-center sm:mb-8">{title}</TypographyH1>
        ) : null}
        {mainImage?.asset?._ref && (
          <Image
            className="w-full rounded-lg"
            src={urlFor(mainImage.asset._ref).width(2000).height(800).url()}
            width={1000}
            height={400}
            alt={title || ""}
            priority={true}
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
              <TypographyH3>Ingredienser</TypographyH3>

              {ingredients ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="inline-flex items-center">
                        <Checkbox
                          checked={
                            anyIngredientsComplete && !allIngredientsComplete
                              ? "indeterminate"
                              : allIngredientsComplete
                          }
                          onCheckedChange={(checked) => {
                            if (checked === "indeterminate") {
                              dispatch({
                                type: "onAllIngredientsCompletionChange",
                                payload: true,
                              });
                            } else {
                              dispatch({
                                type: "onAllIngredientsCompletionChange",
                                payload: checked,
                              });
                            }
                          }}
                        />
                      </TableHead>
                      <TableHead>Ingrediens</TableHead>
                      <TableHead>Mengde</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ingredients.map(({ ingredientId, name, amount, unit }) => {
                      const isComplete = isIngredientComplete(
                        ingredientsCompletion,
                        ingredientId,
                      );

                      const checkboxId = `ingredient-${ingredientId}-complete`;

                      return (
                        <TableRow key={ingredientId}>
                          <TableCell>
                            <div>
                              <Checkbox
                                id={checkboxId}
                                checked={isComplete}
                                onCheckedChange={(checked) => {
                                  if (checked === "indeterminate") return;

                                  dispatch({
                                    type: "onIngredientCompletionChange",
                                    payload: {
                                      ingredientId,
                                      completed: checked,
                                    },
                                  });
                                }}
                              />
                            </div>
                          </TableCell>
                          <TableCell>
                            <Label
                              htmlFor={checkboxId}
                              className="hover:cursor-pointer"
                            >
                              {name}
                            </Label>
                          </TableCell>
                          <TableCell>
                            {formatAmount(amount)} {unit}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              ) : null}
            </div>
          </div>
          <div className="col-span-full align-baseline md:col-span-8">
            {scaleFactor !== 100 && (
              <Alert>
                <InfoCircledIcon />
                <AlertTitle>Skalert oppskrift</AlertTitle>
                <AlertDescription>
                  Denne oppskriften er skalert {formatAmount(scaleFactor, 0)}% i
                  forhold til original oppskrift. Ta kontakt hvis oppskriften
                  ikke gir mening eller noen av ingrediensene ikke blir riktig
                  skalert.
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
