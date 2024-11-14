import { defineField, defineType } from "sanity";
import { ingredientTypeName } from "./constants";

const fields = [
  defineField({
    name: "name",
    type: "string",
    validation: (rule) => rule.required(),
  }),
  defineField({
    name: "type",
    type: "string",
    options: {
      list: [
        { title: "Dry", value: "dry" },
        { title: "Wet", value: "wet" },
        { title: "Other", value: "other" },
      ],
      layout: "radio",
    },
    validation: (rule) => rule.required(),
  }),
  defineField({
    name: "matpratName",
    type: "string",
    description:
      "The name of the ingredient from matprat.no. Used to automatically fetch weights.",
    validation: (rule) => rule.lowercase().error("Must be lowercase"),
  }),
  defineField({
    name: "weights",
    type: "ingredientWeights",
  }),
];

export const ingredientType = defineType({
  name: ingredientTypeName,
  title: "Ingredient",
  type: "document",
  icon: () => "🥒",
  fields,
});
