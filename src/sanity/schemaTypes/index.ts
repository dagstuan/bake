import { type SchemaTypeDefinition } from "sanity";

import { blockContentType } from "./blockContentType";
import { categoryType } from "./categoryType";
import { ingredientType } from "./ingredientType";
import { recipeType } from "./recipe/recipeType";
import { recipeIngredientType } from "./recipe/recipeIngredientType";
import { recipeIngredientReferenceType } from "./recipe/recipeIngredientReference";
import { scalableRecipeNumberType } from "./recipe/scalableRecipeNumberType";
import { timeValueType } from "./timeValueType";
import { durationType } from "./durationType";
import { homeType } from "./singletons/homeType";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    blockContentType,
    categoryType,
    recipeType,
    ingredientType,
    recipeIngredientType,
    recipeIngredientReferenceType,
    scalableRecipeNumberType,
    timeValueType,
    durationType,
    homeType,
  ],
};
