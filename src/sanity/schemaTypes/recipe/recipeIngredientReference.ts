import { defineType, isReference } from "sanity";
import { TagIcon } from "@sanity/icons";
import { isRecipe } from "./utils";
import { RecipeIngredientReferenceInlineBlockComponent } from "@/sanity/components/RecipeIngredientReferenceInlineBlockComponent";

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
          if (!isRecipe(document)) {
            return false;
          }

          const ids: string[] =
            document.ingredients
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
      ingredientUnit: "ingredient.unit",
      percentage: "percentage",
    },
  },
  components: {
    preview: RecipeIngredientReferenceInlineBlockComponent,
  },
});
