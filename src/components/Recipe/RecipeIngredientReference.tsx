import { Button } from "../ui/button";
import { RecipeIngredientReference } from "./types";
import { cn } from "@/lib/utils";
import { useRecipeContext } from "./recipeContext";
import { formatAmount } from "@/utils/recipeUtils";
import { CheckIcon } from "../icons/CheckIcon";
import { SquareIcon } from "../icons/SquareIcon";

type RecipeIngredientReferenceResultProps = {
  value: NonNullable<RecipeIngredientReference>;
};

export const RecipeIngredientReferenceResult = ({
  value,
}: RecipeIngredientReferenceResultProps) => {
  const { sumDryIngredients, ingredientsCompletion, dispatch } =
    useRecipeContext();

  if (!value.ingredient || !value.ingredient?.percent || !value.percentage) {
    return null;
  }

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
      {completed ? <CheckIcon /> : <SquareIcon />}
    </Button>
  );
};
