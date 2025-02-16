import { RecipeIngredientReferenceInlineBlockComponent } from "@/sanity/components/RecipeIngredientReferenceInlineBlockComponent";
import { TagIcon } from "@sanity/icons";
import { defineField, defineType, isReference } from "sanity";
import {
  ingredientGroupTypeName,
  recipeIngredientReferenceTypeName,
} from "./constants";
import { isRecipe } from "./utils";

const fields = [
  defineField({
    name: "ingredient",
    type: "reference",
    to: [{ type: "recipeIngredient" }],
    validation: (rule) =>
      rule.custom((value, { document }) => {
        if (!value) {
          return "You must select an ingredient";
        }

        if (!document || !isRecipe(document) || !isReference(value)) {
          return true;
        }

        if (
          document.ingredients
            ?.map((i) => {
              if (i._type === ingredientGroupTypeName) {
                return (
                  i.ingredients?.map((ingredient) => ingredient._ref) ?? []
                );
              }
              return [i._ref];
            })
            .flat()
            .some((ingredientRef) => ingredientRef === value._ref)
        ) {
          return true;
        }

        return "The selected ingredient is not part of the recipe";
      }),
    options: {
      filter: ({ document }) => {
        if (!isRecipe(document)) {
          return {};
        }

        const ids: string[] =
          document.ingredients
            ?.map((ingredient) => {
              if (ingredient._type === ingredientGroupTypeName) {
                return (
                  ingredient.ingredients?.map(
                    (ingredient) => ingredient._ref,
                  ) ?? []
                );
              } else {
                return [ingredient._ref];
              }
            })
            .flat() ?? [];

        return {
          filter: "_type == $type && _id in $ids",
          params: {
            type: "recipeIngredient",
            ids,
          },
        };
      },
      disableNew: true,
    },
  }),
  defineField({
    name: "percentage",
    type: "number",
    title: "Percentage",
    initialValue: 100,
    validation: (rule) => rule.required(),
  }),
  defineField({
    name: "hideCheckbox",
    type: "boolean",
    title: "Hide checkbox",
    initialValue: false,
    fieldset: "options",
  }),
  defineField({
    name: "hideComment",
    type: "boolean",
    initialValue: false,
    fieldset: "options",
  }),
];

export const recipeIngredientReferenceType = defineType({
  name: recipeIngredientReferenceTypeName,
  title: "Ingredient Reference",
  type: "object",
  icon: TagIcon,
  fields,
  fieldsets: [
    {
      name: "options",
      title: "Options",
      options: {
        columns: 2,
      },
    },
  ],
  preview: {
    select: {
      ingredientName: "ingredient.ingredient.name",
      ingredientPercent: "ingredient.percent",
      ingredientUnit: "ingredient.unit",
      percentage: "percentage",
    },
  },
  components: {
    preview: RecipeIngredientReferenceInlineBlockComponent,
  },
});
