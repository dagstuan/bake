import { defineQuery } from "next-sanity";

export const frontPageRecipesQuery =
  defineQuery(`*[_type == "recipe"]|order(_createdAt desc)[0...6]{
  _id, title, slug, mainImage
}`);

export const allRecipesQuery =
  defineQuery(`*[_type == "recipe"]|order(_createdAt desc){
  _id, title, slug, mainImage
}`);

export const recipeQuery =
  defineQuery(`*[_type == "recipe" && slug.current == $slug][0]{
    _id,
    title,
    mainImage,
    ingredients[]->{
      _id,
      "ingredient": ingredient->{
        name,
        type,
      },
      unit,
      percent,
    },
    baseDryIngredients,
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
              _id,
              "name": ingredient->.name,
              percent,
              unit,
            },
          }
        }
      }
    }
}`);
