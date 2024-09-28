import { ArrayElement } from "@/utils/tsUtils";
import { RecipeQueryResult } from "../../../sanity.types";

export type RecipeIngredientReference = Extract<
  ArrayElement<
    NonNullable<
      ArrayElement<NonNullable<RecipeQueryResult>["instructions"]>["children"]
    >
  >,
  { _type: "recipeIngredientReference" }
>;
