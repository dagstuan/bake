import { RecipeIngredientReference } from "../types";
import { cn } from "@/lib/utils";
import { useRecipeContext } from "../recipeContext";
import { formatAmount } from "@/utils/recipeUtils";
import { Label } from "../../ui/label";
import { RecipeIngredientReferenceCheckbox } from "./checkbox";

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

  const checkboxId = `ingredient-reference-${_id}`;

  return (
    <>
      <span
        className={cn(
          "inline-flex h-auto items-center justify-center gap-1 rounded-md bg-muted pr-2 align-baseline leading-6 focus-within:bg-accent focus-within:ring-1 focus-within:ring-ring hover:cursor-pointer hover:bg-accent hover:text-accent-foreground",
          {
            ["bg-muted-foreground text-muted focus-within:bg-stone-600 focus-within:ring-green-900 hover:bg-muted-foreground hover:text-muted"]:
              completed,
          },
        )}
      >
        <Label
          htmlFor={checkboxId}
          className="pl mr-[calc(-14px_-_0.5rem_-_0.25rem)] flex-1 pl-2 pr-[calc(14px_+_0.5rem_+_0.25rem)] text-sm font-medium leading-6 hover:cursor-pointer"
        >
          {formatAmount(ingredientState?.amount)} {unit} {name}
        </Label>
        <RecipeIngredientReferenceCheckbox
          id={checkboxId}
          checked={completed}
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
