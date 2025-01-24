import { SchemaPluginOptions } from "sanity";

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
import { initialValueTemplates } from "./initialValueTemplates";
import { imageGalleryType } from "./imageGallery";
import { ingredientWeightsType } from "./ingredientWeightsType";
import { ingredientConversionType } from "./ingredientConversionType";

export const schema: SchemaPluginOptions = {
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
    imageGalleryType,
    ingredientWeightsType,
    ingredientConversionType,
  ],
  templates: initialValueTemplates,
};
