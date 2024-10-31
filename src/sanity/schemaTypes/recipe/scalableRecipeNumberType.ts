import { defineField, defineType } from "sanity";
import { scalableRecipeNumberTypeName } from "./constants";

export const scalableRecipeNumberType = defineType({
  name: scalableRecipeNumberTypeName,
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
