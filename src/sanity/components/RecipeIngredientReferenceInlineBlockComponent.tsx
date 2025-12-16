import { PreviewProps } from "sanity";
import {
  Ingredient,
  Recipe,
  RecipeIngredient,
  RecipeIngredientReference_2,
} from "../../../sanity.types";
import { useFormValue } from "./utils";
import { formatAmount } from "@/utils/recipeUtils";

type RecipeIngredientReferenceInlineBlockComponentProps = PreviewProps & {
  ingredientName: Ingredient["name"];
  ingredientPercent: RecipeIngredient["percent"];
  ingredientUnit: RecipeIngredient["unit"];
  percentage: RecipeIngredientReference_2["percentage"];
};

const isRecipeIngredientReferenceInlineBlockComponentProps = (
  props: PreviewProps,
): props is RecipeIngredientReferenceInlineBlockComponentProps => {
  return (
    "ingredientName" in props &&
    "ingredientPercent" in props &&
    "ingredientUnit" in props &&
    "percentage" in props
  );
};

const formatTitle = (
  props: RecipeIngredientReferenceInlineBlockComponentProps,
  sumBaseIngredients: number,
) => {
  const baseTitle = `${props.ingredientName}`;

  if (!props.ingredientPercent || !props.percentage || !props.ingredientUnit) {
    return baseTitle;
  }

  const percent = props.ingredientPercent;
  const amount =
    sumBaseIngredients * (props.percentage / 100) * (percent / 100);

  return `${baseTitle} - ${formatAmount(amount, props.ingredientUnit)}`;
};

export const RecipeIngredientReferenceInlineBlockComponent = (
  props: PreviewProps,
) => {
  const sumBaseIngredients =
    useFormValue<Recipe["baseDryIngredients"]>(["baseDryIngredients"]) ?? 0;

  if (
    props.layout !== "inline" ||
    !isRecipeIngredientReferenceInlineBlockComponentProps(props)
  ) {
    return props.renderDefault(props);
  }

  return props.renderDefault({
    ...props,
    title: formatTitle(props, sumBaseIngredients),
  });
};
