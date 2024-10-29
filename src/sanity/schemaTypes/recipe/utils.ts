import { isTypedObject } from "sanity";
import { Recipe, RecipeIngredient } from "../../../../sanity.types";
import { recipeIngredientTypeName, recipeTypeName } from "./constants";

export const isRecipe = (document: unknown): document is Recipe => {
  return isTypedObject(document) && document._type === recipeTypeName;
};

export const isRecipeIngredient = (
  document: unknown,
): document is RecipeIngredient => {
  return isTypedObject(document) && document._type === recipeIngredientTypeName;
};
