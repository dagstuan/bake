import { PreviewProps } from "sanity";
import { Recipe, RecipeIngredient } from "../../../sanity.types";

import { formatAmount } from "@/utils/recipeUtils";
import {
  baseDryIngredientsName,
  ingredientsName,
  recipeTypeName,
} from "../schemaTypes/recipe/constants";
import { useFormValue } from "./utils";
import { ingredientTypeName } from "../schemaTypes/constants";

type RecipeIngredientPreviewProps = PreviewProps & { _id: string } & {
  ingredientType: typeof ingredientTypeName | typeof recipeTypeName;
  ingredientName: string | null;
  ingredientTitle: string | null;
  percent: RecipeIngredient["percent"];
  unit: RecipeIngredient["unit"];
  comment: RecipeIngredient["comment"];
  excludeFromTotalYield: RecipeIngredient["excludeFromTotalYield"];
};

const isRecipeIngredientPreviewProps = (
  props: PreviewProps,
): props is RecipeIngredientPreviewProps => {
  return (
    "_id" in props &&
    "ingredientType" in props &&
    "ingredientName" in props &&
    "ingredientTitle" in props &&
    "percent" in props &&
    "unit" in props &&
    "comment" in props &&
    "excludeFromTotalYield" in props
  );
};

const formatTitle = (
  props: RecipeIngredientPreviewProps,
  sumBaseIngredients: number,
) => {
  const title =
    props.ingredientType === recipeTypeName
      ? props.ingredientTitle
      : props.ingredientName;

  const baseTitle = `${title}${props.comment ? ` (${props.comment})` : ""}`;

  if (!props.percent) {
    return baseTitle;
  }

  const percent = props.percent;
  const amount = sumBaseIngredients * (percent / 100);

  return `${baseTitle} - ${formatAmount(amount, props.unit)} (${formatAmount(percent, "%")})`;
};

const RecipeIngredientPreviewComponentInner = (
  props: RecipeIngredientPreviewProps,
) => {
  const sumBaseIngredients =
    useFormValue<Recipe["baseDryIngredients"]>([baseDryIngredientsName]) ?? 0;
  const parentIngredients = useFormValue<Recipe["ingredients"]>([
    ingredientsName,
  ]);

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
        subtitle: `${parentIngredient?.group ?? ""}${props.excludeFromTotalYield ? " (excluded from yield)" : ""}`,
      })}
    </div>
  );
};

export const RecipeIngredientPreviewComponent = (props: PreviewProps) => {
  if (props.layout === "block" || !isRecipeIngredientPreviewProps(props)) {
    return props.renderDefault(props);
  }

  return <RecipeIngredientPreviewComponentInner {...props} />;
};
