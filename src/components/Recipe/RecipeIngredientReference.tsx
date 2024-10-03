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
  const { ingredients, ingredientsCompletion, dispatch } = useRecipeContext();

  if (
    !value.ingredient ||
    !value.ingredient._id ||
    !value.ingredient.percent ||
    !value.percentage
  ) {
    return null;
  }

  const { _id, name, unit } = value.ingredient;

  const ingredientState = ingredients.find((i) => i.ingredientId === _id);

  const completed =
    ingredientsCompletion[_id]?.[value._key]?.completed ?? false;

  return (
    <Button
      variant="outline"
      className={cn(`align-center inline-flex h-6 gap-1 bg-muted px-2`, {
        ["bg-green-100 hover:bg-green-200"]: completed,
      })}
      onClick={() =>
        dispatch({
          type: "onIngredientReferenceCompletionChange",
          payload: {
            ingredientId: _id,
            ingredientReferenceKey: value._key,
          },
        })
      }
    >
      {formatAmount(ingredientState?.amount)} {unit} {name}
      {completed ? <CheckIcon /> : <SquareIcon />}
    </Button>
  );
};
