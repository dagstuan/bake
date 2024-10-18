import { defineField, defineType } from "sanity";
import { recipeIngredientArrayMember } from "./recipeType";
import { IngredientGroupItemComponent } from "@/sanity/components/IngredientGroupItemComponent";

export const ingredientGroupType = defineType({
  name: "ingredientGroup",
  title: "Ingredient group",
  type: "object",
  fields: [
    defineField({
      name: "title",
      type: "string",
    }),
    defineField({
      name: "ingredients",
      type: "array",
      of: [recipeIngredientArrayMember],
    }),
  ],
  components: {
    item: IngredientGroupItemComponent,
  },
});
