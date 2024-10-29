import { RecipeIngredientPreviewComponent } from "@/sanity/components/RecipeIngredientPreviewComponent";
import { defineField, defineType } from "sanity";
import { isRecipeIngredient } from "./utils";
import { recipeIngredientTypeName } from "./constants";

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
  }),
  defineField({
    name: "unit",
    type: "string",
    options: {
      list: ["g", "dl", "ts", "ss", "stk", "fedd"],
    },
    validation: (rule) =>
      rule.custom((value, { parent }) => {
        if (!isRecipeIngredient(parent)) {
          return true;
        }

        const percent = parent.percent;

        if (percent === undefined || percent === null) {
          return true;
        }

        return value !== undefined && value !== null
          ? true
          : "Required if value is set";
      }),
  }),
  defineField({
    name: "comment",
    type: "string",
    description:
      "Shown in parenthesis after the ingredient in the recipe table.",
    validation: (rule) => rule.max(50).error("Max 50 characters"),
  }),
];

export const recipeIngredientType = defineType({
  name: recipeIngredientTypeName,
  title: "Recipe Ingredient",
  type: "document",
  icon: () => "🍌",
  fields,
  preview: {
    select: {
      title: "ingredient.name",
      percent: "percent",
      unit: "unit",
    },
  },
  components: {
    preview: RecipeIngredientPreviewComponent,
  },
});
