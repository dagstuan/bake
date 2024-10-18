import { RecipeIngredientPreviewComponent } from "@/sanity/components/RecipeIngredientPreviewComponent";
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
  icon: () => "🍌",
  fields,
  preview: {
    select: {
      ingredientName: "ingredient.name",
      percent: "percent",
      unit: "unit",
    },
  },
  components: {
    preview: RecipeIngredientPreviewComponent,
  },
});
