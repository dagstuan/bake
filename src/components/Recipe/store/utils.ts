import { IngredientUnit } from "../types";
import { RecipeIngredientsState, RecipeIngredientState } from "./types";

export const calcIngredientAmount = (
  percent: number | null | undefined,
  baseIngredientsAmount: number,
): number | undefined =>
  percent ? baseIngredientsAmount * (percent / 100) : undefined;

export const getWeightInGramsForUnit = (
  weights: RecipeIngredientState["weights"],
  unit: IngredientUnit,
): number => {
  switch (unit) {
    case "g":
      return 1;
    case "kg":
      return 1000;
    case "dl":
      return (weights.l ?? 1) / 10;
    case "l":
      return weights.l ?? 1;
    case "ts":
      return weights.ts ?? 1;
    case "ss":
      return weights.ss ?? 1;
    default:
      return 1;
  }
};

export const calculateTotalYield = (ingredients: RecipeIngredientsState) => {
  return ingredients.reduce((acc, currIngredient) => {
    const { amount, unit, weights } = currIngredient;

    if (!amount || !unit || !weights) {
      return acc;
    }

    const weightInGrams = getWeightInGramsForUnit(weights, unit);
    const amountGrams = amount * weightInGrams;

    return acc + amountGrams;
  }, 0);
};
