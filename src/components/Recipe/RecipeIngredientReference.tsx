import { Button } from "../ui/button";
import { Check, Square } from "lucide-react";
import { RecipeIngredientReference } from "./types";

type RecipeIngredientReferenceResultProps = {
  value: RecipeIngredientReference;
  sumDryIngredients: number;
  completed: boolean;
  toggleCompleted: (ingredientId: string, key: string) => void;
};

export const RecipeIngredientReferenceResult = ({
  value,
  sumDryIngredients,
  completed,
  toggleCompleted,
}: RecipeIngredientReferenceResultProps) => {
  if (
    !value ||
    !value.ingredient ||
    !value.ingredient?.percent ||
    !value.percentage
  ) {
    return null;
  }

  const unit = value.ingredient.unit ?? "g";

  const amount =
    sumDryIngredients *
    (value.ingredient.percent / 100) *
    (value.percentage / 100);

  return (
    <Button
      variant="outline"
      className={`align-center inline-flex h-7 gap-1 bg-muted px-2 ${completed ? "bg-green-100 hover:bg-green-200" : ""}`}
      onClick={() => toggleCompleted(value.ingredient!._id, value._key)}
    >
      {parseFloat(amount.toFixed(1))} {unit} {value.ingredient.name}
      {completed ? (
        <Check strokeWidth={1} size={16} />
      ) : (
        <Square strokeWidth={1} size={16} />
      )}
    </Button>
  );
};
