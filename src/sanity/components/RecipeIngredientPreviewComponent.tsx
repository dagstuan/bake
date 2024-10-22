import { Path, PreviewProps, useFormValue as sanityUseFormValue } from "sanity";
import { Recipe, RecipeIngredient } from "../../../sanity.types";
import {
  baseDryIngredientsName,
  ingredientsName,
} from "../schemaTypes/recipe/recipeType";
import { formatAmount } from "@/utils/recipeUtils";

type RecipeIngredientPreviewProps = PreviewProps & { _id: string } & {
  title: string | null;
  percent: RecipeIngredient["percent"];
  unit: RecipeIngredient["unit"];
};

const isRecipeIngredientPreviewProps = (
  props: PreviewProps,
): props is RecipeIngredientPreviewProps => {
  return (
    "_id" in props && "title" in props && "percent" in props && "unit" in props
  );
};

const useFormValue = sanityUseFormValue as <TVal>(path: Path) => TVal;

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

  const percent = props.percent ?? 100;
  const amount = sumBaseIngredients * (percent / 100);
  const unit = props.unit ?? "g";

  return (
    <div>
      {props.renderDefault({
        ...props,
        title: `${props.title} - ${formatAmount(amount, 1)}${unit} (${formatAmount(percent)}%)`,
        subtitle: parentIngredient?.group,
      })}
    </div>
  );
};
