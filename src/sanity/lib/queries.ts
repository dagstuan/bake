import { defineQuery } from "next-sanity";

export const recipesQuery = defineQuery(`*[_type == "recipe"][0..12]{
  _id, title, slug
}`);

export const recipeQuery =
  defineQuery(`*[_type == "recipe" && slug.current == $slug][0]{
    title,
    ingredients[]->{
      _id,
      "ingredient": ingredient->{
        name,
        type,
      },
      amount,
      unit
    },
    servings,
    instructions[]{
      ...,
      _type == "block" => {
        ...,
        children[]{
          ...,
          _type == "recipeIngredientReference" => {
            ...,
            "ingredient": @.ingredient->{
              "name": ingredient->.name,
              unit,
              amount,
            },
          }
        }
      }
    }
}`);
