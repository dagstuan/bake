import { defineType, defineArrayMember, defineField } from "sanity";
import { ImageIcon } from "@sanity/icons";
import { alertType } from "../alertType";
import { baseBlockStyles } from "./baseBlockStyles";
import { baseBlockLists } from "./baseBlockLists";
import { baseBlockMarks } from "./baseBlockMarks";
import {
  blockContentTypeName,
  imageGalleryTypeName,
  recipeCardTypeName,
} from "../constants";
import { recipeTypeName } from "../recipe/constants";

export const alertArrayMember = defineArrayMember({
  type: alertType.name,
  icon: () => "⚠️",
});

export const imageArrayMember = defineArrayMember({
  type: "image",
  icon: ImageIcon,
  options: { hotspot: true },
  fields: [
    defineField({
      name: "caption",
      type: "string",
      title: "Caption",
      description: "Optional caption for the image.",
    }),
    defineField({
      name: "alt",
      type: "string",
      title: "Alternative Text",
      validation: (rule) => rule.required(),
    }),
  ],
});

export const recipeCardArrayMember = defineArrayMember({
  name: recipeCardTypeName,
  type: "object",
  title: "Recipe Card",
  fields: [
    defineField({
      type: "reference",
      name: "recipe",
      to: [{ type: recipeTypeName }],
    }),
  ],
  preview: {
    select: {
      title: "recipe.title",
      media: "recipe.mainImage",
    },
  },
});

export const imageGalleryArrayMember = defineArrayMember({
  type: imageGalleryTypeName,
});

export const blockContentType = defineType({
  title: "Block Content",
  name: blockContentTypeName,
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      styles: baseBlockStyles,
      lists: baseBlockLists,
      marks: baseBlockMarks,
    }),
    imageArrayMember,
    alertArrayMember,
    imageGalleryArrayMember,
    recipeCardArrayMember,
  ],
});
