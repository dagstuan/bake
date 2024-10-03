import { defineField, defineType } from "sanity";

export const scalableRecipeNumberType = defineType({
  name: "scalableRecipeNumber",
  title: "Scalable recipe number",
  type: "object",
  fields: [
    defineField({
      name: "number",
      type: "number",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "number",
    },
  },
});
