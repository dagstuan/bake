import { formatAmount } from "@/utils/recipeUtils";
import { defineField, defineType } from "sanity";

const fields = [
  defineField({
    name: "ingredient",
    type: "reference",
    to: { type: "ingredient" },
    validation: (rule) => rule.required(),
  }),
  defineField({
    name: "percent",
    type: "number",
    validation: (rule) => rule.required(),
  }),
  defineField({
    name: "unit",
    type: "string",
    options: {
      list: ["g", "dl", "ts", "ss", "stk", "egg"],
    },
  }),
];

export const recipeIngredientType = defineType({
  name: "recipeIngredient",
  title: "Recipe Ingredient",
  type: "document",
  fields,
  preview: {
    select: {
      ingredientName: "ingredient.name",
      percent: "percent",
    },
    prepare({ ingredientName, percent }) {
      return {
        title: `${ingredientName} (${formatAmount(percent)}%)`,
      };
    },
  },
});
