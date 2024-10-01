import { RecipeIngredientsState } from "./recipeReducer";

export const calcIngredientAmount = (
  percent: number,
  sumDryIngredients: number,
): number => sumDryIngredients * (percent / 100);

export const calcSumDryIngredients = (
  ingredients: RecipeIngredientsState,
): number =>
  ingredients
    .filter((i) => i.type === "dry")
    .reduce((acc, curr) => acc + curr.amount, 0);
