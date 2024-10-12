import { defineArrayMember, defineField, defineType } from "sanity";
import { recipeType } from "../recipe/recipeType";
import { ComposeIcon, SearchIcon } from "@sanity/icons";

export const homeType = defineType({
  name: "home",
  title: "Home",
  type: "document",
  icon: () => "🏠",
  groups: [
    { name: "content", title: "Content", icon: ComposeIcon, default: true },
    { name: "seo", title: "SEO", icon: SearchIcon },
  ],
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
    defineField({
      name: "seo",
      type: "seo",
      group: ["seo"],
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
