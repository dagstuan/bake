import { defineField, defineType } from "sanity";

const fields = [
  defineField({
    name: "ingredient",
    type: "reference",
    to: { type: "ingredient" },
    validation: (rule) => rule.required(),
  }),
  defineField({
    name: "amount",
    type: "number",
    validation: (rule) => rule.required(),
  }),
  defineField({
    name: "unit",
    type: "string",
    options: {
      list: [
        { title: "g", value: "g" },
        { title: "kg", value: "kg" },
        { title: "dl", value: "dl" },
        { title: "ml", value: "ml" },
        { title: "l", value: "l" },
        { title: "tbsp", value: "tbsp" },
      ],
    },
    initialValue: "g",
    validation: (rule) => rule.required(),
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
      amount: "amount",
      unit: "unit",
      percent: "percent",
    },
    prepare({ ingredientName, amount, unit }) {
      return {
        title: `${amount}${unit} ${ingredientName}`,
      };
    },
  },
});
