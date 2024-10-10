import { DocumentTextIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";
import {
  baseBlockLists,
  baseBlockMarks,
  baseBlockStyles,
} from "../blockContentType";
import { recipeIngredientReferenceType } from "./recipeIngredientReference";
import { scalableRecipeNumberType } from "./scalableRecipeNumberType";

export const recipeType = defineType({
  name: "recipe",
  title: "Recipe",
  type: "document",
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: "title",
      type: "string",
    }),
    defineField({
      name: "slug",
      type: "slug",
      options: {
        source: "title",
      },
    }),
    defineField({
      name: "mainImage",
      type: "image",
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
      of: [defineArrayMember({ type: "reference", to: { type: "category" } })],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "activeTime",
      type: "duration",
      title: "Active time",
    }),
    defineField({
      name: "totalTime",
      type: "duration",
      title: "Total time",
    }),
    defineField({
      name: "baseDryIngredients",
      type: "number",
      title: "Sum base ingredients",
      description: "The sum of all base ingredients in grams",
      initialValue: 1000,
    }),
    defineField({
      name: "servings",
      description: "The amount of servings the base ingredients make",
      type: "number",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "ingredients",
      type: "array",
      of: [
        defineArrayMember({
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
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "instructions",
      title: "Instructions",
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
