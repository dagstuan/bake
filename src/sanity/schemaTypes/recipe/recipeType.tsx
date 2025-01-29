import {
  defineArrayMember,
  defineField,
  defineType,
  Path,
  ValidationError,
} from "sanity";

import { IngredientItemComponent } from "@/sanity/components/IngredientItemComponent";
import { IngredientsInputComponent } from "@/sanity/components/IngredientsInputComponent";
import { isDefined } from "@/utils/tsUtils";
import { ComposeIcon, SearchIcon } from "@sanity/icons";
import { ChefHat } from "lucide-react";
import { Recipe, RecipeIngredientReference } from "../../../../sanity.types";
import { baseBlockLists } from "../portableText/baseBlockLists";
import { baseBlockMarks } from "../portableText/baseBlockMarks";
import { baseBlockStyles } from "../portableText/baseBlockStyles";
import {
  alertArrayMember,
  imageArrayMember,
  imageGalleryArrayMember,
} from "../portableText/blockContentType";
import {
  baseDryIngredientsName,
  ingredientGroupTypeName,
  ingredientsName,
  IngredientsNameType,
  recipeTypeName,
} from "./constants";
import { recipeIngredientReferenceType } from "./recipeIngredientReference";
import { scalableRecipeNumberType } from "./scalableRecipeNumberType";
import { isRecipe } from "./utils";

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
  validation: (rule) => rule.required(),
  components: {
    item: IngredientItemComponent,
    input: IngredientsInputComponent,
  },
});

const isReferenced = (references: string[], ref: string) => {
  return references.includes(ref);
};

const createUnreferencedIngredientError = (path: Path): ValidationError => ({
  path,
  message: "Ingredient is not used in the instructions",
});

export const recipeType = defineType({
  name: recipeTypeName,
  title: "Recipe",
  type: "document",
  icon: () => <ChefHat size={16} />,
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
      name: "visible",
      type: "boolean",
      group: ["content"],
      description:
        "Set to visible when this recipe should be visible on the front-end.",
      initialValue: false,
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
      name: baseDryIngredientsName,
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
      name: ingredientsName,
      group: ["content"],
      type: "array",
      of: [
        recipeIngredientArrayMember,
        defineArrayMember({ type: ingredientGroupTypeName }),
      ],
      validation: (rule) =>
        rule
          .required()
          .custom((value: Recipe[IngredientsNameType], { parent }) => {
            if (!isRecipe(parent)) {
              return true;
            }

            const instructions = parent.instructions ?? [];
            const ingredientRefsInInstructions = instructions
              .reduce<RecipeIngredientReference[]>((acc, block) => {
                if (block._type === "block") {
                  const children = block.children ?? [];

                  const childRefs = children.filter(
                    (child) =>
                      child._type === recipeIngredientReferenceType.name,
                  );

                  return [...acc, ...childRefs];
                }

                return acc;
              }, [])
              .map((item) => item.ingredient?._ref)
              .filter(isDefined);

            const validationErrors = (value ?? []).reduce<ValidationError[]>(
              (acc, item) => {
                if (item._type === ingredientGroupTypeName) {
                  const groupIngredients = item.ingredients ?? [];
                  const results = groupIngredients
                    .filter(
                      (groupIngredient) =>
                        !isReferenced(
                          ingredientRefsInInstructions,
                          groupIngredient._ref,
                        ),
                    )
                    .map<ValidationError>((groupIngredient) =>
                      createUnreferencedIngredientError([
                        { _key: item._key },
                        "ingredients",
                        { _key: groupIngredient._key },
                      ]),
                    );

                  return [...acc, ...results];
                }

                if (!isReferenced(ingredientRefsInInstructions, item._ref)) {
                  return [
                    ...acc,
                    createUnreferencedIngredientError([{ _key: item._key }]),
                  ];
                }

                return acc;
              },
              [],
            );

            return validationErrors.length > 0 ? validationErrors : true;
          }),
    }),
    defineField({
      name: "instructions",
      title: "Instructions",
      group: ["content"],
      type: "array",
      of: [
        defineArrayMember({
          type: "block",
          styles: baseBlockStyles.filter((s) => s.value !== "h2"),
          lists: baseBlockLists,
          marks: baseBlockMarks,
          of: [
            { type: recipeIngredientReferenceType.name },
            { type: scalableRecipeNumberType.name },
          ],
        }),
        alertArrayMember,
        imageArrayMember,
        imageGalleryArrayMember,
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
  },
});
