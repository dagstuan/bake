import { ArrayElement } from "@/utils/tsUtils";
import { RecipeQueryResult } from "../../../sanity.types";
import { Badge } from "../ui/badge";

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

  const unit = value.ingredient.unit ?? "g";

  const amount =
    sumDryIngredients *
    (value.ingredient.percent / 100) *
    (value.percentage / 100);

  return (
    <Badge variant="default">
      {parseFloat(amount.toFixed(1))} {unit} {value.ingredient.name}
    </Badge>
  );
};
