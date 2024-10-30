import { PreviewProps } from "sanity";
import { Recipe, RecipeIngredient } from "../../../sanity.types";

import { formatAmount } from "@/utils/recipeUtils";
import { useFormValue } from "./utils";
import {
  baseDryIngredientsName,
  ingredientsName,
} from "../schemaTypes/recipe/constants";

type RecipeIngredientPreviewProps = PreviewProps & { _id: string } & {
  title: string | null;
  percent: RecipeIngredient["percent"];
  unit: RecipeIngredient["unit"];
  comment: RecipeIngredient["comment"];
};

const isRecipeIngredientPreviewProps = (
  props: PreviewProps,
): props is RecipeIngredientPreviewProps => {
  return (
    "_id" in props && "title" in props && "percent" in props && "unit" in props
  );
};

const formatTitle = (
  props: RecipeIngredientPreviewProps,
  sumBaseIngredients: number,
) => {
  const baseTitle = `${props.title}${props.comment ? ` (${props.comment})` : ""}`;

  if (!props.percent) {
    return baseTitle;
  }

  const percent = props.percent ?? 100;
  const amount = sumBaseIngredients * (percent / 100);

  return `${baseTitle} - ${formatAmount(amount, 1)}${props.unit} (${formatAmount(percent)}%)`;
};

export const RecipeIngredientPreviewComponent = (props: PreviewProps) => {
  const sumBaseIngredients =
    useFormValue<Recipe["baseDryIngredients"]>([baseDryIngredientsName]) ?? 0;
  const parentIngredients = useFormValue<Recipe["ingredients"]>([
    ingredientsName,
  ]);

  if (!isRecipeIngredientPreviewProps(props)) {
    return props.renderDefault(props);
  }

  const parentIngredient = parentIngredients
    ?.map((ingredient) => {
      if (ingredient._type === "reference") {
        return [
          {
            id: ingredient._ref,
            group: "",
          },
        ];
      }

      return (
        ingredient.ingredients?.map((i) => ({
          id: i._ref,
          group: ingredient.title,
        })) ?? []
      );
    })
    .flat()
    .find((i) => i.id === props._id);

  return (
    <div>
      {props.renderDefault({
        ...props,
        title: formatTitle(props, sumBaseIngredients),
        subtitle: parentIngredient?.group,
      })}
    </div>
  );
};
