import { RecipeIngredientPreviewComponent } from "@/sanity/components/RecipeIngredientPreviewComponent";
import { Wheat } from "lucide-react";
import { defineField, defineType } from "sanity";
import { recipeIngredientTypeName, recipeTypeName } from "./constants";
import { isRecipeIngredient } from "./utils";
import { ingredientTypeName } from "../constants";

const fields = [
  defineField({
    name: "ingredient",
    type: "reference",
    to: [{ type: ingredientTypeName }, { type: recipeTypeName }],
    validation: (rule) => rule.required(),
  }),
  defineField({
    name: "percent",
    type: "number",
  }),
  defineField({
    name: "unit",
    type: "string",
    options: {
      list: ["g", "dl", "ts", "ss", "stk", "fedd", "neve", "kg", "l"],
    },
    validation: (rule) =>
      rule.custom((value, { parent }) => {
        if (!isRecipeIngredient(parent)) {
          return true;
        }

        const percent = parent.percent;

        if (percent === undefined) {
          return true;
        }

        return value !== undefined ? true : "Required if value is set";
      }),
  }),
  defineField({
    name: "comment",
    type: "string",
    description:
      "Shown in parenthesis after the ingredient in the recipe table.",
    validation: (rule) => rule.max(50).error("Max 50 characters"),
  }),
  defineField({
    name: "excludeFromTotalYield",
    type: "boolean",
    title: "Exclude from total yield",
    description:
      "If checked, the weight of this ingredient will not be included in the total yield.",
  }),
];

export const recipeIngredientType = defineType({
  name: recipeIngredientTypeName,
  title: "Recipe Ingredient",
  type: "document",
  icon: () => <Wheat size={16} />,
  fields,
  preview: {
    select: {
      ingredientType: "ingredient._type",
      ingredientName: "ingredient.name",
      ingredientTitle: "ingredient.title",
      percent: "percent",
      unit: "unit",
      comment: "comment",
      excludeFromTotalYield: "excludeFromTotalYield",
    },
    prepare: (selection) => {
      return {
        ...selection,
        title: String(
          selection.ingredientName ?? selection.ingredientTitle ?? "Untitled",
        ),
      };
    },
  },
  components: {
    preview: RecipeIngredientPreviewComponent,
  },
});
