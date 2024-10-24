import { RecipeIngredient } from "../../../sanity.types";
import { recipeIngredientType } from "./recipe/recipeIngredientType";
import { defineTemplate } from "../utils";

export const recipeIngredientWithPercentage = defineTemplate<
  { percent: number },
  Partial<RecipeIngredient>
>({
  id: "recipeIngredientWithPercentage",
  title: "Recipe Ingredient with Percentage",
  schemaType: recipeIngredientType.name,
  parameters: [{ name: "percent", type: "number", title: "Percentage" }],
  value: (params) => {
    if (!params?.percent) {
      return {};
    }

    return {
      _type: recipeIngredientType.name,
      percent: params.percent,
    };
  },
});

export const initialValueTemplates = [recipeIngredientWithPercentage];
