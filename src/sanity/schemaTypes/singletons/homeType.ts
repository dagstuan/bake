import { defineArrayMember, defineField, defineType } from "sanity";
import { recipeType } from "../recipe/recipeType";

export const homeType = defineType({
  name: "home",
  title: "Home",
  type: "document",
  icon: () => "🏠",
  fields: [
    defineField({
      name: "subtitle",
      title: "Subtitle",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "recipes",
      title: "Recipes",
      type: "array",
      of: [
        defineArrayMember({
          type: "reference",
          to: { type: recipeType.name },
        }),
      ],
      validation: (Rule) => Rule.required().min(3).max(6).unique(),
    }),
  ],
  preview: {
    select: {
      subtitle: "subtitle",
    },
    prepare({ subtitle }) {
      return {
        title: "Home",
        subtitle,
      };
    },
  },
});
