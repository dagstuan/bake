import { RecipeIngredientReference } from "./types";
import { useRecipeContext } from "./recipeContext";
import { formatAmount } from "@/utils/recipeUtils";
import { HighlightWithCheckbox } from "@/components/PortableText/HighlightWithCheckbox";

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

  const { percentage: referencePercentage } = value;

  const { _id, name, unit } = value.ingredient;

  const ingredientState = ingredients.find((i) => i.ingredientId === _id);

  const mappedAmount =
    (ingredientState?.amount ?? 0) * (referencePercentage / 100);

  const completed =
    ingredientsCompletion[_id]?.[value._key]?.completed ?? false;

  const labelText = `${formatAmount(mappedAmount)} ${unit} ${name}`;

  return (
    <HighlightWithCheckbox
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
    >
      {labelText}
    </HighlightWithCheckbox>
  );
};
