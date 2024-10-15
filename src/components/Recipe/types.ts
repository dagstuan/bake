import { ArrayElement } from "@/utils/types";
import { RecipeQueryResult } from "../../../sanity.types";

export type RecipeInstructions = NonNullable<RecipeQueryResult>["instructions"];
export type RecipeIngredients = NonNullable<RecipeQueryResult>["ingredients"];

export type RecipeIngredientReference = Extract<
  ArrayElement<NonNullable<ArrayElement<RecipeInstructions>["children"]>>,
  { _type: "recipeIngredientReference" }
>;

export type ScalableRecipeNumber = Extract<
  ArrayElement<NonNullable<ArrayElement<RecipeInstructions>["children"]>>,
  { _type: "scalableRecipeNumber" }
>;

export type RecipeIngredient = Extract<
  ArrayElement<RecipeIngredients>,
  { _type: "reference" }
>;
