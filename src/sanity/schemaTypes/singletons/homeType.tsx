import { ComposeIcon, SearchIcon } from "@sanity/icons";
import { House } from "lucide-react";
import { defineArrayMember, defineField, defineType } from "sanity";
import { homeTypeName } from "../constants";
import { recipeType } from "../recipe/recipeType";

export const homeType = defineType({
  name: homeTypeName,
  title: "Home",
  type: "document",
  icon: () => <House size={16} />,
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
    prepare(selection) {
      return {
        title: "Home",
        subtitle: `${selection.subtitle}`,
      };
    },
  },
});
