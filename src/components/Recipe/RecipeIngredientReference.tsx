"use client";

import { HighlightWithCheckbox } from "@/components/PortableText/HighlightWithCheckbox";
import { formatAmount } from "@/utils/recipeUtils";
import { isDefined, unCapitalize } from "@/utils/tsUtils";
import { useStore } from "zustand";
import { useShallow } from "zustand/react/shallow";
import { Highlight } from "../PortableText/Highlight";
import { useRecipeContext } from "./recipeContext";
import { RecipeIngredientReference } from "./types";

interface RecipeIngredientReferenceResultProps {
  value: NonNullable<RecipeIngredientReference>;
}

export const RecipeIngredientReferenceResult = ({
  value,
}: RecipeIngredientReferenceResultProps) => {
  const recipeStore = useRecipeContext();

  const [
    ingredients,
    ingredientsCompletion,
    onIngredientReferenceCompletionChange,
  ] = useStore(
    recipeStore,
    useShallow((s) => [
      s.ingredients,
      s.ingredientsCompletion,
      s.onIngredientReferenceCompletionChange,
    ]),
  );

  if (!value.ingredient?._id) {
    return null;
  }

  const { percentage: referencePercentage, hideCheckbox } = value;

  const { _id } = value.ingredient;

  const ingredientState = ingredients.find((i) => i.id === _id);

  const mappedAmount =
    isDefined(ingredientState?.amount) && isDefined(referencePercentage)
      ? ingredientState.amount * (referencePercentage / 100)
      : null;

  const amountLabel = isDefined(mappedAmount)
    ? `${formatAmount(mappedAmount, ingredientState?.unit)} `
    : "";

  const labelText = `${amountLabel}${unCapitalize(ingredientState?.name)}${ingredientState?.comment ? ` (${ingredientState.comment})` : ""}`;

  return hideCheckbox ? (
    <Highlight>{labelText}</Highlight>
  ) : (
    <HighlightWithCheckbox
      checked={ingredientsCompletion[_id]?.[value._key]?.completed ?? false}
      title={`Marker ${labelText.toLowerCase()} som fullført`}
      onCheckedChange={() => {
        onIngredientReferenceCompletionChange(_id, value._key);
      }}
    >
      {labelText}
    </HighlightWithCheckbox>
  );
};
