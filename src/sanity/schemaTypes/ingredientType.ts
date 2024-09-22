import { defineField, defineType } from "sanity";

const fields = [
  defineField({
    name: "name",
    type: "string",
    validation: rule => rule.required(),
  }),
  defineField({
    name: "type",
    type: "string",
    options: {
      list: [
        {title: 'Dry', value: 'dry'},
        {title: 'Wet', value: 'wet'},
        {title: 'Other', value: 'other'}
      ],
      layout: 'radio'
    },
    validation: rule => rule.required(),
  })
]

export const ingredientType = defineType({
  name: "ingredient",
  title: "Ingredient",
  type: "document",
  fields,
});