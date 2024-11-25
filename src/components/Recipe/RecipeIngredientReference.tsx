"use client";

import { RecipeIngredientReference } from "./types";
import { useRecipeContext } from "./recipeContext";
import { formatAmount } from "@/utils/recipeUtils";
import { HighlightWithCheckbox } from "@/components/PortableText/HighlightWithCheckbox";
import { isDefined } from "@/utils/tsUtils";
import { Highlight } from "../PortableText/Highlight";
import { useStore } from "zustand";
import { useShallow } from "zustand/react/shallow";

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

  const { _id, name } = value.ingredient;

  const ingredientState = ingredients.find((i) => i.id === _id);

  const mappedAmount =
    isDefined(ingredientState?.amount) && isDefined(referencePercentage)
      ? ingredientState.amount * (referencePercentage / 100)
      : null;

  const amountLabel = isDefined(mappedAmount)
    ? `${formatAmount(mappedAmount, ingredientState?.unit)} `
    : "";

  const labelText = `${amountLabel}${name}`;

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
