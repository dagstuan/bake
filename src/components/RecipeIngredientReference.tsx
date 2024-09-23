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
  servingsPercent: number;
};

export const RecipeIngredientReferenceResult = ({
  value,
  servingsPercent,
}: RecipeIngredientReferenceResultProps) => {
  if (!value || !value.ingredient?.amount || !value.percentage) {
    return null;
  }

  const amount = value.ingredient.amount * servingsPercent;

  return (
    <span>
      {amount * (value.percentage / 100)}
      {value.ingredient.unit} {value.ingredient.name}
    </span>
  );
};
