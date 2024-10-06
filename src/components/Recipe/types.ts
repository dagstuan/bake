import { ArrayElement } from "@/utils/types";
import { RecipeQueryResult } from "../../../sanity.types";

export type RecipeIngredientReference = Extract<
  ArrayElement<
    NonNullable<
      ArrayElement<NonNullable<RecipeQueryResult>["instructions"]>["children"]
    >
  >,
  { _type: "recipeIngredientReference" }
>;

export type ScalableRecipeNumber = Extract<
  ArrayElement<
    NonNullable<
      ArrayElement<NonNullable<RecipeQueryResult>["instructions"]>["children"]
    >
  >,
  { _type: "scalableRecipeNumber" }
>;

export type RecipeInstructions = NonNullable<RecipeQueryResult>["instructions"];
export type RecipeIngredients = NonNullable<RecipeQueryResult>["ingredients"];
