import { OmitStrict } from "@/utils/types";
import { RecipeQueryResult } from "../../../../sanity.types";
import {
  RecipeIngredient,
  RecipeIngredients,
  RecipeInstructions,
} from "../types";
import {
  IngredientsCompletionState,
  IngredientsGroupOrder,
  RecipeIngredientsState,
  RecipeState,
} from "./types";
import { calcIngredientAmount, calculateTotalYield } from "./utils";

const calcInitialIngredientsCompletionState = (
  instructions: RecipeInstructions | null | undefined,
): IngredientsCompletionState => {
  if (!instructions) {
    return {};
  }

  return instructions
    .filter((i) => i._type === "block")
    .reduce<IngredientsCompletionState>((state, instruction) => {
      const ingredientReferences = instruction.children
        ?.filter((x) => x._type === "recipeIngredientReference")
        .filter((x) => x.hideCheckbox !== true);

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

const mapIngredientReferenceToIngredient = (
  baseDryIngredients: number,
  group: string | null,
  ingredientRef: OmitStrict<RecipeIngredient, "_type"> | null,
): RecipeIngredientsState[number] | null => {
  const { _id, ingredient, percent, unit, comment, excludeFromTotalYield } =
    ingredientRef ?? {};

  if (!_id || !ingredient?._type) {
    return null;
  }

  switch (ingredient._type) {
    case "ingredient":
      return ingredient.name
        ? {
            type: "ingredient",
            id: _id,
            name: ingredient.name,
            percent: percent ?? undefined,
            group: group,
            amount:
              calcIngredientAmount(percent, baseDryIngredients) ?? undefined,
            unit: unit,
            weights: {
              l: ingredient.weights?.liter ?? null,
              ss: ingredient.weights?.tablespoon ?? null,
              ts: ingredient.weights?.teaspoon ?? null,
              stk: ingredient.weights?.piece ?? null,
            },
            conversions:
              ingredient.conversions?.map((c) => ({
                to: c.to?.name ?? "Unknown",
                rate: c.rate ?? 1,
                weights: {
                  l: c.to?.weights?.liter ?? null,
                  ss: c.to?.weights?.tablespoon ?? null,
                  ts: c.to?.weights?.teaspoon ?? null,
                  stk: c.to?.weights?.piece ?? null,
                },
              })) ?? [],
            comment: comment,
            excludeFromTotalYield: excludeFromTotalYield ?? false,
          }
        : null;
    case "recipe":
      return ingredient.title
        ? {
            type: "recipe",
            id: _id,
            name: ingredient.title,
            slug: ingredient.slug,
            percent: percent ?? undefined,
            group: group,
            amount:
              calcIngredientAmount(percent, baseDryIngredients) ?? undefined,
            unit: unit,
            weights: {
              l: null,
              ss: null,
              ts: null,
              stk: null,
            },
            conversions: [],
            comment: comment,
            excludeFromTotalYield: excludeFromTotalYield ?? false,
          }
        : null;
    default:
      return null;
  }
};

const calcInitialRecipeIngredientsState = (
  baseDryIngredients: number,
  recipeIngredientsQueryResult: RecipeIngredients | null | undefined,
): [IngredientsGroupOrder, RecipeIngredientsState] => {
  const groupOrder: IngredientsGroupOrder = [];

  const ingredientsState =
    recipeIngredientsQueryResult
      ?.map((ingredientRef) => {
        if (ingredientRef._type === "reference") {
          return [
            mapIngredientReferenceToIngredient(
              baseDryIngredients,
              null,
              ingredientRef,
            ),
          ];
        } else if (
          ingredientRef.title != null &&
          (ingredientRef.ingredients?.length ?? 0) > 0
        ) {
          groupOrder.push(ingredientRef.title);

          return ingredientRef.ingredients?.map((ingredient) =>
            mapIngredientReferenceToIngredient(
              baseDryIngredients,
              ingredientRef.title,
              ingredient,
            ),
          );
        }
      })
      .flat()
      .filter((r) => r != null) ?? [];

  return [groupOrder, ingredientsState];
};

export const calcInitialState = (
  recipe: NonNullable<RecipeQueryResult>,
): RecipeState => {
  const { _rev, servings, instructions, ingredients, baseDryIngredients } =
    recipe;

  const initialServingsNum = servings ?? 1;
  const initialDryIngredients = baseDryIngredients ?? 1000;

  const [groupOrder, ingredientsState] = calcInitialRecipeIngredientsState(
    initialDryIngredients,
    ingredients,
  );

  const totalYield = calculateTotalYield(ingredientsState);

  return {
    recipeRevision: _rev,
    initialServings: initialServingsNum,
    servings: initialServingsNum,
    ingredientsGroupOrder: groupOrder,
    ingredientsCompletion: calcInitialIngredientsCompletionState(instructions),
    ingredients: ingredientsState,
    totalYield: totalYield,
    yieldPerServing: totalYield / initialServingsNum,
  };
};
