import { ArrayElement } from "@/utils/tsUtils";
import { RecipeQueryResult } from "../../sanity.types";

type RecipeIngredientReferenceResult = Extract<
  ArrayElement<
    NonNullable<
      ArrayElement<NonNullable<RecipeQueryResult>["instructions"]>["children"]
    >
  >,
  { _type: "recipeIngredientReference" }
>;

type RecipeIngredientReferenceResultProps = {
  value: RecipeIngredientReferenceResult;
  sumDryIngredients: number;
};

export const RecipeIngredientReferenceResult = ({
  value,
  sumDryIngredients,
}: RecipeIngredientReferenceResultProps) => {
  if (!value || !value.ingredient?.percent || !value.percentage) {
    return null;
  }

  const amount =
    sumDryIngredients *
    (value.ingredient.percent / 100) *
    (value.percentage / 100);

  return (
    <span>
      {amount.toFixed(0)}g {value.ingredient.name}
    </span>
  );
};
