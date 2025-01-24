import { defineField, defineType } from "sanity";
import { ingredientConversionTypeName, ingredientTypeName } from "./constants";

const fields = [
  defineField({
    name: "to",
    type: "reference",
    to: [{ type: ingredientTypeName }],
    validation: (rule) => rule.required(),
  }),
  defineField({
    name: "rate",
    type: "number",
    title: "Rate",
    description:
      "The rate of conversion. What is 1g of this ingredient in the other ingredient?",
    validation: (rule) => rule.required(),
  }),
];

export const ingredientConversionType = defineType({
  name: ingredientConversionTypeName,
  type: "object",
  fields,
  preview: {
    select: {
      to: "to.name",
      rate: "rate",
    },
    prepare({ to, rate }) {
      return {
        title: `1g to ${rate}g of ${to}`,
      };
    },
  },
});
