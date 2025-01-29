import { IngredientGroupItemComponent } from "@/sanity/components/IngredientGroupItemComponent";
import { Component } from "lucide-react";
import { defineField, defineType } from "sanity";
import { ingredientGroupTypeName } from "./constants";
import { recipeIngredientArrayMember } from "./recipeType";

export const ingredientGroupType = defineType({
  name: ingredientGroupTypeName,
  title: "Ingredient group",
  icon: () => <Component size={16} />,
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
