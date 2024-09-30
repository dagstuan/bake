import { RecipeIngredientsState } from "./recipeReducer";

export const calcIngredientAmount = (
  percent: number,
  sumDryIngredients: number,
) => parseFloat((sumDryIngredients * (percent / 100)).toFixed(1));

export const calcSumDryIngredients = (ingredients: RecipeIngredientsState) =>
  ingredients
    .filter((i) => i.type === "dry")
    .reduce((acc, curr) => acc + curr.amount, 0);
