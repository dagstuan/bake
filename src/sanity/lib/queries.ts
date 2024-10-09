import { defineQuery } from "next-sanity";

const baseRecipesQuery = /* groq */ `_type == "recipe"`;
const recipesSearchMatchQuery = /* groq */ `(pt::text(instructions) match $searchQuery || title match $searchQuery)`;
const recipesCategoryFilterQuery = /* groq */ `count((categories[]->slug.current)[@ in $categories]) > 0`;
const recipesScoreQuery = /* groq */ `score(pt::text(instructions) match $searchQuery, boost(title match $searchQuery, 3))`;
const recipesScoreOrderQuery = /* groq */ `order(_score desc)`;
const recipesCreatedAtOrderQuery = /* groq */ `order(_createdAt desc)`;
const allRecipesFields = /* groq */ `
  _id,
  title,
  slug,
  mainImage {
    alt,
    asset->{
      _id,
      metadata {
        ...,
        lqip
      }
    },
  }
`;

export const frontPageRecipesQuery = defineQuery(`*[${baseRecipesQuery}]
  |${recipesCreatedAtOrderQuery}
  [0...6]
  {
    ${allRecipesFields}
  }`);

export const allRecipesQuery = defineQuery(`*[${baseRecipesQuery}]
  |${recipesCreatedAtOrderQuery}
  {
    ${allRecipesFields}
  }`);

export const recipesSearchQuery = defineQuery(`*[
    ${baseRecipesQuery} &&
    ${recipesSearchMatchQuery}]
    |${recipesCreatedAtOrderQuery}
    |${recipesScoreQuery}
    |${recipesScoreOrderQuery}
    {
      ${allRecipesFields}
    }`);

export const recipesSearchWithCategoriesQuery =
  defineQuery(`*[${baseRecipesQuery} &&
  ${recipesSearchMatchQuery} &&
  ${recipesCategoryFilterQuery}]
  |${recipesCreatedAtOrderQuery}
  |${recipesScoreQuery}
  |${recipesScoreOrderQuery}
  {
    ${allRecipesFields}
  }`);

export const allCategoriesQuery = defineQuery(`*[_type == "category"]{
  _id, title, "slug": slug.current,
}`);

export const recipeQuery =
  defineQuery(`*[_type == "recipe" && slug.current == $slug][0]{
    _id,
    title,
    mainImage {
      alt,
      asset->{
        _id,
        metadata {
          ...,
          lqip
        }
      },
    },
    ingredients[]->{
      _id,
      "ingredient": ingredient->{
        name,
        type,
      },
      unit,
      percent,
    },
    activeTime,
    totalTime,
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

export const pageSlugQuery = defineQuery(`*[_id == $pageId][0]{
  _type,
  "slug": slug.current,
}`);
