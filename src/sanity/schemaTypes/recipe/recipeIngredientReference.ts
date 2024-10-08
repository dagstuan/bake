import { defineType, Reference } from "sanity";
import { Recipe } from "../../../../sanity.types";
import { formatAmount } from "@/utils/recipeUtils";
import { TagIcon } from "@sanity/icons";

export const recipeIngredientReferenceType = defineType({
  name: "recipeIngredientReference",
  title: "Ingredient Reference",
  type: "object",
  icon: TagIcon,
  fields: [
    {
      name: "ingredient",
      type: "reference",
      to: [{ type: "recipeIngredient" }],
      validation: (rule) =>
        rule.custom((value: Reference | null, { document }) => {
          if (!value) {
            return "You must select an ingredient";
          }

          if (!document) {
            return true;
          }

          if (
            (document as Recipe).ingredients?.some(
              (ingredient) => ingredient._ref === value._ref,
            )
          ) {
            return true;
          }

          return "The selected ingredient is not part of the recipe";
        }),
      options: {
        filter: ({ document }) => {
          if (document._type !== "recipe") {
            return false;
          }

          const recipe = document as Recipe;

          return {
            filter: "_type == $type && _id in $ids",
            params: {
              type: "recipeIngredient",
              ids:
                recipe.ingredients?.map((ingredient) => ingredient._ref) ?? [],
            },
          };
        },
        disableNew: true,
      },
    },
    {
      name: "percentage",
      type: "number",
      initialValue: 100,
      validation: (rule) => rule.required(),
    },
  ],
  preview: {
    select: {
      ingredientName: "ingredient.ingredient.name",
      ingredientPercent: "ingredient.percent",
      percentage: "percentage",
    },
    prepare({ ingredientName, ingredientPercent, percentage }) {
      if (!ingredientName) {
        return { title: "Unknown ingredient" };
      }

      const shownAmount = ingredientPercent * (percentage / 100);

      return {
        title: `${ingredientName} (${formatAmount(shownAmount)}%)`,
      };
    },
  },
});
