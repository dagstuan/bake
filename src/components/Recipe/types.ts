import { RecipeQueryResult } from "../../../sanity.types";
import { FilterByType, Get } from "@sanity/codegen";

export type RecipeInstructions = Get<RecipeQueryResult, "instructions">;
export type RecipeIngredients = Get<RecipeQueryResult, "ingredients">;

type RecipeInstructionsBlockChilds = Get<
  FilterByType<Get<RecipeInstructions, number>, "block">,
  "children",
  number
>;

export type RecipeIngredientReference = FilterByType<
  RecipeInstructionsBlockChilds,
  "recipeIngredientReference"
>;

export type ScalableRecipeNumber = FilterByType<
  RecipeInstructionsBlockChilds,
  "scalableRecipeNumber"
>;

export type RecipeIngredient = FilterByType<
  Get<RecipeIngredients, number>,
  "reference"
>;

export type IngredientUnit = NonNullable<Get<RecipeIngredient, "unit">>;
