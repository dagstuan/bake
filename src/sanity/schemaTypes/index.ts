import { type SchemaTypeDefinition } from "sanity";

import { blockContentType } from "./portableText/blockContentType";
import { categoryType } from "./categoryType";
import { ingredientType } from "./ingredientType";
import { recipeType } from "./recipe/recipeType";
import { recipeIngredientType } from "./recipe/recipeIngredientType";
import { recipeIngredientReferenceType } from "./recipe/recipeIngredientReference";
import { scalableRecipeNumberType } from "./recipe/scalableRecipeNumberType";
import { timeValueType } from "./timeValueType";
import { durationType } from "./durationType";
import { homeType } from "./singletons/homeType";
import { aboutType } from "./singletons/aboutType";
import { seoType } from "./seoType";
import { ingredientGroupType } from "./recipe/ingredientGroup";
import { alertType } from "./alertType";

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
    aboutType,
    seoType,
    ingredientGroupType,
    alertType,
  ],
};
