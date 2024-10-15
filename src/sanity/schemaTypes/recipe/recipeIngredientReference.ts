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

          const recipe = document as Recipe;

          if (
            recipe.ingredients
              ?.map((i) => {
                if (i._type === "ingredientGroup") {
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
          if (document._type !== "recipe") {
            return false;
          }

          const recipe = document as Recipe;

          const ids: string[] =
            recipe.ingredients
              ?.map((ingredient) => {
                if (ingredient._type === "ingredientGroup") {
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
