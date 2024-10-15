import { defineArrayMember, defineField, defineType } from "sanity";
import {
  baseBlockLists,
  baseBlockMarks,
  baseBlockStyles,
} from "../blockContentType";
import { recipeIngredientReferenceType } from "./recipeIngredientReference";
import { scalableRecipeNumberType } from "./scalableRecipeNumberType";
import { ComposeIcon, SearchIcon } from "@sanity/icons";

export const recipeIngredientArrayMember = defineArrayMember({
  type: "reference",
  to: { type: "recipeIngredient" },
  options: {
    filter: ({ document }) => {
      return {
        filter: `_type == $type
          && count(*[references(^._id) && !(_id in [$nonDraftDocumentId, $documentId])]) == 0
          && !(_id in *[_id == $documentId].ingredients[]._ref)`,
        params: {
          type: "recipeIngredient",
          documentId: document._id,
          nonDraftDocumentId: document._id.replace(/^drafts\./, ""),
        },
      };
    },
  },
});

export const recipeType = defineType({
  name: "recipe",
  title: "Recipe",
  type: "document",
  icon: () => "📜",
  groups: [
    { name: "content", title: "Content", icon: ComposeIcon, default: true },
    { name: "seo", title: "SEO", icon: SearchIcon },
  ],
  fields: [
    defineField({
      name: "title",
      type: "string",
      group: ["content"],
    }),
    defineField({
      name: "slug",
      type: "slug",
      group: ["content"],
      options: {
        source: "title",
      },
    }),
    defineField({
      name: "mainImage",
      type: "image",
      group: ["content"],
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alternative text",
        },
      ],
    }),
    defineField({
      name: "categories",
      type: "array",
      group: ["content"],
      of: [defineArrayMember({ type: "reference", to: { type: "category" } })],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "activeTime",
      type: "duration",
      title: "Active time",
      group: ["content"],
    }),
    defineField({
      name: "totalTime",
      type: "duration",
      title: "Total time",
      group: ["content"],
    }),
    defineField({
      name: "baseDryIngredients",
      type: "number",
      title: "Sum base ingredients",
      description: "The sum of all base ingredients in grams",
      group: ["content"],
      initialValue: 1000,
    }),
    defineField({
      name: "servings",
      description: "The amount of servings the base ingredients make",
      type: "number",
      group: ["content"],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "ingredients",
      group: ["content"],
      type: "array",
      of: [
        recipeIngredientArrayMember,
        defineArrayMember({ type: "ingredientGroup" }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "instructions",
      title: "Instructions",
      group: ["content"],
      type: "array",
      of: [
        {
          type: "block",
          styles: baseBlockStyles,
          lists: baseBlockLists,
          marks: baseBlockMarks,
          of: [
            { type: recipeIngredientReferenceType.name },
            { type: scalableRecipeNumberType.name },
          ],
        },
      ],
    }),
    defineField({
      name: "seo",
      type: "seo",
      group: ["seo"],
    }),
  ],
  preview: {
    select: {
      title: "title",
      media: "mainImage",
    },
    prepare(selection) {
      return { ...selection };
    },
  },
});
