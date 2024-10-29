import { isTypedObject } from "sanity";
import { recipeType } from "./recipeType";
import { Recipe } from "../../../../sanity.types";

export const isRecipe = (document: unknown): document is Recipe => {
  return isTypedObject(document) && document._type === recipeType.name;
};
