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
    defineField({
      name: "suffix",
      type: "string",
    }),
  ],
  preview: {
    select: {
      title: "number",
      suffix: "suffix",
    },
    prepare({ title, suffix }) {
      return {
        title: `${title}${suffix ? ` ${suffix}` : ""}`,
      };
    },
  },
});
