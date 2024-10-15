import { defineField, defineType } from "sanity";
import { recipeIngredientArrayMember } from "./recipeType";

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
});
