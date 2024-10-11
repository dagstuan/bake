import { RecipeIngredientReference } from "../types";
import { cn } from "@/lib/utils";
import { useRecipeContext } from "../recipeContext";
import { formatAmount } from "@/utils/recipeUtils";
import { Label } from "../../ui/label";
import { RecipeIngredientReferenceCheckbox } from "./checkbox";
import { useId } from "react";

type RecipeIngredientReferenceResultProps = {
  value: NonNullable<RecipeIngredientReference>;
};

export const RecipeIngredientReferenceResult = ({
  value,
}: RecipeIngredientReferenceResultProps) => {
  const checkboxId = useId();
  const { ingredients, ingredientsCompletion, dispatch } = useRecipeContext();

  if (
    !value.ingredient ||
    !value.ingredient._id ||
    !value.ingredient.percent ||
    !value.percentage
  ) {
    return null;
  }

  const { percentage: referencePercentage } = value;

  const { _id, name, unit } = value.ingredient;

  const ingredientState = ingredients.find((i) => i.ingredientId === _id);

  const mappedAmount =
    (ingredientState?.amount ?? 0) * (referencePercentage / 100);

  const completed =
    ingredientsCompletion[_id]?.[value._key]?.completed ?? false;

  const labelText = `${formatAmount(mappedAmount)} ${unit} ${name}`;

  return (
    <>
      <span
        className={cn(
          "inline-flex h-auto items-center justify-center gap-1 rounded-md border border-gray-200 bg-accent pr-2 align-baseline leading-6 text-accent-foreground focus-within:bg-secondary focus-within:ring-1 focus-within:ring-ring hover:cursor-pointer hover:bg-muted",
          {
            ["bg-muted text-muted-foreground hover:bg-muted"]: completed,
          },
        )}
      >
        <Label
          htmlFor={checkboxId}
          className="pl mr-[calc(-14px_-_0.5rem_-_0.25rem)] flex-1 pl-2 pr-[calc(14px_+_0.5rem_+_0.25rem)] text-base font-[450] leading-6 hover:cursor-pointer"
        >
          {labelText}
        </Label>
        <RecipeIngredientReferenceCheckbox
          id={checkboxId}
          checked={completed}
          title={`Marker ${labelText?.toLowerCase() ?? "ingrediensen"} som fullført`}
          onCheckedChange={() =>
            dispatch({
              type: "onIngredientReferenceCompletionChange",
              payload: {
                ingredientId: _id,
                ingredientReferenceKey: value._key,
              },
            })
          }
        />
      </span>
    </>
  );
};
