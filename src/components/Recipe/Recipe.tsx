"use client";

import { RecipeQueryResult } from "../../../sanity.types";
import { useReducer } from "react";
import { RecipeIngredientReferenceResult } from "./RecipeIngredientReference";
import { recipeIngredientReferenceType } from "@/sanity/schemaTypes/recipeIngredientReference";
import { PortableText } from "./PortableText";
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
import { RecipeIngredientReference } from "./types";
import { CheckIcon } from "lucide-react";
import { TypographyP } from "../Typography/TypographyP";
import { cn } from "@/lib/utils";
import { WakeLockToggle } from "./WakeLockToggle";
import { calcSumDryIngredients } from "./utils";
import { calcInitialState, recipeReducer } from "./recipeReducer";
import { RecipeEditor } from "./RecipeEditor";

type RecipeProps = {
  recipe: RecipeQueryResult;
};

export const Recipe = ({ recipe }: RecipeProps) => {
  const { title, mainImage, instructions } = recipe ?? {};

  const [
    { ingredients, ingredientsCompletion, servings, yieldPerServing },
    dispatch,
  ] = useReducer(recipeReducer, calcInitialState(recipe));

  const isIngredientComplete = (ingredientId: string) => {
    const ingredient = ingredientsCompletion[ingredientId];

    if (!ingredient) {
      return false;
    }

    return Object.values(ingredient).every((x) => x.completed);
  };

  const isIngredientRefComplete = (
    ingredientId: string,
    ingredientRefKey: string,
  ) => {
    return (
      ingredientsCompletion[ingredientId]?.[ingredientRefKey]?.completed ??
      false
    );
  };

  const reset = () => {
    dispatch({
      type: "reset",
      payload: calcInitialState(recipe),
    });
  };

  const sumDryIngredients = calcSumDryIngredients(ingredients);

  return (
    <main className="prose prose-lg container mx-auto mb-10 flex max-w-6xl flex-col gap-8 p-6 pt-8 sm:pt-12">
      {title ? (
        <TypographyH1 className="text-center sm:mb-12">{title}</TypographyH1>
      ) : null}
      {mainImage?.asset?._ref && (
        <Image
          className="w-full rounded-lg"
          src={urlFor(mainImage.asset._ref).width(1000).height(400).url()}
          width={1000}
          height={400}
          alt={title || ""}
          priority={true}
        />
      )}
      <div className="grid grid-cols-1 gap-10 sm:grid-cols-12 sm:gap-4">
        <div className="col-span-full flex flex-col gap-4 sm:col-span-4">
          <WakeLockToggle />

          <div className="flex gap-2">
            <RecipeEditor
              servings={servings}
              yieldPerServing={yieldPerServing}
              ingredients={ingredients}
              onChange={(newServings, newIngredients) =>
                dispatch({
                  type: "onRecipeChange",
                  payload: {
                    servings: newServings,
                    ingredients: newIngredients,
                  },
                })
              }
              onReset={reset}
            />
            <Button type="button" variant="outline" onClick={reset}>
              Tilbakestill
            </Button>
          </div>

          <TypographyP className="!mt-0">
            Antall:{" "}
            <span className="font-bold">{parseFloat(servings.toFixed(2))}</span>
          </TypographyP>

          {ingredients ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ingrediens</TableHead>
                  <TableHead>Prosent</TableHead>
                  <TableHead>Mengde</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ingredients.map(
                  ({ ingredientId, name, percent, amount, unit }) => {
                    const isComplete = isIngredientComplete(ingredientId);

                    return (
                      <TableRow key={ingredientId}>
                        <TableCell
                          className={cn(`flex items-center gap-2`, {
                            ["text-green-800"]: isComplete,
                          })}
                        >
                          {name}
                          {isComplete ? (
                            <CheckIcon strokeWidth={1} size={16} />
                          ) : (
                            <div style={{ width: "16px", height: "16px" }} />
                          )}
                        </TableCell>
                        <TableCell>
                          {parseFloat(percent?.toFixed(1) ?? "0")}%
                        </TableCell>
                        <TableCell>
                          {parseFloat(amount.toFixed(2))} {unit}
                        </TableCell>
                      </TableRow>
                    );
                  },
                )}
              </TableBody>
            </Table>
          ) : null}
        </div>
        <div className="col-span-full align-baseline sm:col-span-8">
          {instructions ? (
            <PortableText
              value={instructions}
              block={{
                normal: ({ children }) => (
                  <TypographyP className="leading-8">{children}</TypographyP>
                ),
              }}
              types={{
                [recipeIngredientReferenceType.name]: ({
                  value,
                }: {
                  value: RecipeIngredientReference;
                }) => (
                  <RecipeIngredientReferenceResult
                    value={value}
                    completed={
                      value.ingredient?._id && value._key
                        ? isIngredientRefComplete(
                            value.ingredient._id,
                            value._key,
                          )
                        : false
                    }
                    sumDryIngredients={sumDryIngredients}
                    toggleCompleted={(
                      ingredientId: string,
                      ingredientReferenceKey: string,
                    ) =>
                      dispatch({
                        type: "onIngredientReferenceCompletionChange",
                        payload: {
                          ingredientId,
                          ingredientReferenceKey,
                        },
                      })
                    }
                  />
                ),
              }}
            />
          ) : null}
        </div>
      </div>
    </main>
  );
};
