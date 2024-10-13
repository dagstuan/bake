import { RecipeIngredientReference } from "../types";
import { cn } from "@/lib/utils";
import { useRecipeContext } from "../recipeContext";
import { formatAmount } from "@/utils/recipeUtils";
import { RecipeIngredientReferenceCheckbox } from "./checkbox";
import { useId } from "react";
import { Highlight } from "../../PortableText/Highlight";
import * as Label from "@radix-ui/react-label";

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
    <Highlight
      className={cn(
        "inline-flex items-center justify-center gap-1 pl-0 pr-1 align-baseline focus-within:bg-secondary focus-within:ring-1 focus-within:ring-ring hover:cursor-pointer hover:bg-muted",
        {
          ["bg-muted text-muted-foreground hover:bg-muted"]: completed,
        },
      )}
    >
      <Label.Root
        htmlFor={checkboxId}
        className="mr-[calc(-14px_-_0.25rem_-_0.25rem)] pl-1 pr-[calc(14px_+_0.25rem_+_0.25rem)] hover:cursor-pointer"
      >
        {labelText}
      </Label.Root>
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
    </Highlight>
  );
};
