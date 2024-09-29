"use client";

import { RecipeQueryResult } from "../../../sanity.types";
import { useState } from "react";
import { RecipeIngredientReferenceResult } from "./RecipeIngredientReference";
import { recipeIngredientReferenceType } from "@/sanity/schemaTypes/recipeIngredientReference";
import { PortableText } from "./PortableText";
import { Input } from "../ui/input";
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
import { Label } from "../ui/label";
import { TypographyH1 } from "../Typography/TypographyH1";
import { Button } from "../ui/button";
import { MinusIcon, PlusIcon } from "@radix-ui/react-icons";
import { RecipeIngredientReference } from "./types";
import { CheckIcon } from "lucide-react";
import { TypographyP } from "../Typography/TypographyP";
import { cn } from "@/lib/utils";
import { WakeLockToggle } from "./WakeLockToggle";

const minServings = 1;
const maxServings = 999;

type RecipeProps = {
  recipe: RecipeQueryResult;
};

type RecipeIngredientReferenceState = {
  completed: boolean;
};

type IngredientsState = {
  [ingredientId: string]: {
    [recipeIngredientKey: string]: RecipeIngredientReferenceState;
  };
};

type Instructions = NonNullable<RecipeQueryResult>["instructions"];

const calcInitialIngredientsState = (
  instructions: Instructions | null | undefined,
): IngredientsState => {
  if (!instructions) {
    return {};
  }

  return instructions.reduce<IngredientsState>((state, instruction) => {
    const ingredientReferences = instruction.children?.filter(
      (x) => x._type === "recipeIngredientReference",
    );

    ingredientReferences?.forEach((recipeInstruction) => {
      const ingredientId = recipeInstruction.ingredient?._id;
      if (!ingredientId) {
        return;
      }

      if (!state[ingredientId]) {
        state[ingredientId] = {};
      }

      const recipeInstructionKey = recipeInstruction._key;
      state[ingredientId][recipeInstructionKey] = {
        completed: false,
      };
    });

    return state;
  }, {});
};

export const Recipe = ({ recipe }: RecipeProps) => {
  const {
    title,
    mainImage,
    servings,
    baseDryIngredients,
    instructions,
    ingredients,
  } = recipe ?? {};

  const [ingredientsState, setIngredientsState] = useState(
    calcInitialIngredientsState(instructions),
  );

  const toggleIngredientReference = (ingredientId: string, key: string) => {
    const currentIngredient = ingredientsState[ingredientId];
    const currentKeyStatus = currentIngredient[key]?.completed ?? false;

    const updatedIngredient = {
      ...currentIngredient,
      [key]: {
        completed: !currentKeyStatus,
      },
    };

    const newState = {
      ...ingredientsState,
      [ingredientId]: updatedIngredient,
    };

    setIngredientsState(newState);
  };

  const isIngredientComplete = (ingredientId: string) => {
    const ingredient = ingredientsState[ingredientId];

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
      ingredientsState[ingredientId]?.[ingredientRefKey]?.completed ?? false
    );
  };

  const initialServings = servings ?? 0;

  const [currentServings, setCurrentServings] = useState(initialServings);
  const [inputValue, setInputValue] = useState<string | number>(
    currentServings,
  );

  const reset = () => {
    setCurrentServings(initialServings);
    setInputValue(initialServings);
    setIngredientsState(calcInitialIngredientsState(instructions));
  };

  const servingsPercent = currentServings / initialServings;

  const currentSumDryIngredients = (baseDryIngredients ?? 0) * servingsPercent;

  return (
    <main className="prose prose-lg container mx-auto mb-10 flex max-w-6xl flex-col gap-8 p-6 pt-8 sm:pt-12">
      {title ? (
        <TypographyH1 className="text-center sm:mb-12">{title}</TypographyH1>
      ) : null}
      {mainImage?.asset?._ref ? (
        <Image
          className="w-full rounded-lg"
          src={urlFor(mainImage.asset._ref).width(1000).height(400).url()}
          width={1000}
          height={400}
          alt={title || ""}
          priority={true}
        />
      ) : null}
      <div className="grid grid-cols-1 gap-10 sm:grid-cols-12 sm:gap-4">
        <div className="col-span-full flex flex-col gap-4 sm:col-span-4">
          <WakeLockToggle />
          <div className="flex items-end justify-between">
            <div>
              <Label htmlFor="servings">Antall</Label>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => {
                    if (currentServings > minServings) {
                      const newValue = currentServings - 1;
                      setInputValue(newValue);
                      setCurrentServings(newValue);
                    }
                  }}
                >
                  <MinusIcon />
                </Button>
                <Input
                  id="servings"
                  type="number"
                  min={minServings}
                  max={maxServings}
                  className="w-13 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  value={inputValue}
                  onChange={(evt) => {
                    setInputValue(evt.target.value);

                    const numberValue = Number(evt.target.value);
                    if (
                      numberValue >= minServings &&
                      numberValue <= maxServings
                    ) {
                      setCurrentServings(numberValue);
                    }
                  }}
                  onBlur={(evt) => {
                    if (evt.target.value === "") {
                      setInputValue(currentServings);
                    }

                    const numberValue = Number(evt.target.value);
                    if (
                      numberValue >= minServings &&
                      numberValue <= maxServings
                    ) {
                      setCurrentServings(numberValue);
                    } else {
                      setInputValue(currentServings);
                    }
                  }}
                />
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => {
                    if (currentServings < maxServings) {
                      const newValue = currentServings + 1;
                      setInputValue(newValue);
                      setCurrentServings(newValue);
                    }
                  }}
                >
                  <PlusIcon />
                </Button>
              </div>
            </div>
            <Button type="button" variant="default" onClick={reset}>
              Tilbakestill
            </Button>
          </div>

          {ingredientsState ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ingrediens</TableHead>
                  <TableHead>Prosent</TableHead>
                  <TableHead>Mengde</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ingredients?.map(({ _id, ingredient, percent, unit }) => {
                  const { name } = ingredient ?? {};
                  const percentNum = percent ?? 0;
                  const unitStr = unit ?? "g";
                  const isComplete = isIngredientComplete(_id);

                  return (
                    <TableRow key={_id}>
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
                        {parseFloat(
                          (
                            currentSumDryIngredients *
                            (percentNum / 100)
                          ).toFixed(1),
                        )}{" "}
                        {unitStr}
                      </TableCell>
                    </TableRow>
                  );
                })}
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
                    sumDryIngredients={currentSumDryIngredients}
                    toggleCompleted={toggleIngredientReference}
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
