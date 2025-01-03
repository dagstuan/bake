import { OmitStrict } from "@/utils/types";
import { RecipeQueryResult } from "../../../../sanity.types";
import {
  IngredientsCompletionState,
  IngredientsGroupOrder,
  RecipeIngredientsState,
  RecipeIngredientState,
  RecipeState,
} from "./types";
import {
  RecipeIngredient,
  RecipeIngredients,
  RecipeInstructions,
} from "../types";
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
): RecipeIngredientState | null => {
  const { _id, ingredient, percent, unit, comment } = ingredientRef ?? {};

  if (!_id || !ingredient?.name) {
    return null;
  }

  return {
    id: _id,
    name: ingredient.name,
    percent: percent ?? undefined,
    group: group,
    amount: calcIngredientAmount(percent, baseDryIngredients) ?? undefined,
    unit: unit,
    weights: {
      l: ingredient.weights?.liter ?? null,
      ss: ingredient.weights?.tablespoon ?? null,
      ts: ingredient.weights?.teaspoon ?? null,
    },
    comment: comment,
  };
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
    yieldPerServing: totalYield / initialServingsNum,
  };
};
