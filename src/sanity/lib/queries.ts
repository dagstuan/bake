import { defineQuery } from "next-sanity";

const imageFields = /* groq */ `
  alt,
  asset->{
    _id,
    metadata {
      ...,
      lqip
    }
  },`;

const baseRecipesQuery = /* groq */ `_type == "recipe"`;
const recipesSearchMatchQuery = /* groq */ `(pt::text(instructions) match $searchQuery || title match $searchQuery)`;
const recipesCategoryFilterQuery = /* groq */ `count((categories[]->slug.current)[@ in $categories]) > 0`;
const recipesScoreQuery = /* groq */ `score(pt::text(instructions) match $searchQuery, boost(title match $searchQuery, 3))`;
const recipesScoreOrderQuery = /* groq */ `order(_score desc)`;
const recipesCreatedAtOrderQuery = /* groq */ `order(_createdAt desc)`;
const allRecipesFields = /* groq */ `
  _id,
  title,
  "slug": slug.current,
  mainImage {
    ${imageFields}
  }
`;

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

export const allCategoriesQuery = defineQuery(`*[_type == "category"]
  |order(title asc){
    _id, title, "slug": slug.current,
  }`);

export const recipeQuery =
  defineQuery(`*[_type == "recipe" && slug.current == $slug][0]{
    _id,
    _createdAt,
    title,
    mainImage {
      ${imageFields}
    },
    categories[]->{
      title,
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
    },
    seo
}`);

export const pageSlugQuery = defineQuery(`*[_id == $pageId][0]{
  _type,
  "slug": slug.current,
}`);

export const homePageQuery = defineQuery(`*[_type == "home"][0]{
  subtitle,
  recipes[]->{
    _id,
    title,
    "slug": slug.current,
    mainImage {
      ${imageFields}
    },
  },
}`);

export const aboutQuery = defineQuery(`*[_type == "about"][0]{
  title,
  body,
}`);

const sitemapFields = /* groq */ `
  "slug": slug.current,
  _updatedAt,
`;

export const homeSitemapQuery = defineQuery(`*[_type == "home"][0]{
  ${sitemapFields}
}`);

export const aboutSitemapQuery = defineQuery(`*[_type == "about"][0]{
  ${sitemapFields}
}`);

export const recipesSitemapQuery = defineQuery(`*[_type == "recipe"] {
  ${sitemapFields}
}`);

export const homeSeoQuery = defineQuery(`*[_type == "home"][0]{
  seo
}`);
