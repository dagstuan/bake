import { ArrayElement } from "@/utils/types";
import { RecipeQueryResult } from "../../../sanity.types";

export type RecipeInstructions = NonNullable<RecipeQueryResult>["instructions"];
export type RecipeIngredients = NonNullable<RecipeQueryResult>["ingredients"];

type RecipeInstructionsBlockChilds = ArrayElement<
  Extract<ArrayElement<RecipeInstructions>, { _type: "block" }>["children"]
>;

export type RecipeIngredientReference = Extract<
  RecipeInstructionsBlockChilds,
  { _type: "recipeIngredientReference" }
>;

export type ScalableRecipeNumber = Extract<
  RecipeInstructionsBlockChilds,
  { _type: "scalableRecipeNumber" }
>;

export type RecipeIngredient = Extract<
  ArrayElement<RecipeIngredients>,
  { _type: "reference" }
>;
