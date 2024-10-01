import { Button } from "../ui/button";
import { Check, Square } from "lucide-react";
import { RecipeIngredientReference } from "./types";
import { cn } from "@/lib/utils";
import { useRecipeContext } from "./recipeContext";
import { calcSumDryIngredients } from "./utils";
import { formatAmount } from "@/utils/recipeUtils";

type RecipeIngredientReferenceResultProps = {
  value: NonNullable<RecipeIngredientReference>;
};

export const RecipeIngredientReferenceResult = ({
  value,
}: RecipeIngredientReferenceResultProps) => {
  const { ingredients, ingredientsCompletion, dispatch } = useRecipeContext();

  if (!value.ingredient || !value.ingredient?.percent || !value.percentage) {
    return null;
  }

  const sumDryIngredients = calcSumDryIngredients(ingredients);

  const unit = value.ingredient.unit ?? "g";

  const amount =
    sumDryIngredients *
    (value.ingredient.percent / 100) *
    (value.percentage / 100);

  const completed =
    ingredientsCompletion[value.ingredient._id]?.[value._key]?.completed ??
    false;

  return (
    <Button
      variant="outline"
      className={cn(`align-center inline-flex h-7 gap-1 bg-muted px-2`, {
        ["bg-green-100 hover:bg-green-200"]: completed,
      })}
      onClick={() =>
        dispatch({
          type: "onIngredientReferenceCompletionChange",
          payload: {
            ingredientId: value.ingredient!._id,
            ingredientReferenceKey: value._key,
          },
        })
      }
    >
      {formatAmount(amount)} {unit} {value.ingredient.name}
      {completed ? (
        <Check strokeWidth={1} size={16} />
      ) : (
        <Square strokeWidth={1} size={16} />
      )}
    </Button>
  );
};
