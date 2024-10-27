import { defineQuery } from "next-sanity";

const imageFields = /* groq */ `
  hotspot,
  crop,
  alt,
  asset->{
    _id,
    metadata {
      lqip
    }
  },`;

const recipesListFields = /* groq */ `
  _id,
  _createdAt,
  title,
  "slug": slug.current,
  mainImage {
    ${imageFields}
  },
  totalTime,
`;

export const allRecipesSlugQuery = defineQuery(`*[_type == "recipe"]
  {
    "slug": slug.current,
  }`);

export const recipesListQuery = defineQuery(`*[
  _type == "recipe" &&
  (!defined($lastCreatedAt) || (_createdAt < $lastCreatedAt || (_createdAt == $lastCreatedAt && _id < $lastId))) &&
  (pt::text(instructions) match $searchQuery || title match $searchQuery) &&
  (!defined($categories) || (count((categories[]->slug.current)[@ in $categories]) > 0))
]
|order(_createdAt desc)
|score(pt::text(instructions) match $searchQuery, boost(title match $searchQuery, 3))
|order(_score desc)
[0...$amount]
{
  ${recipesListFields}
}`);

export const allCategoriesQuery = defineQuery(`*[_type == "category"]
  |order(title asc)
  {
    _id,
    title,
    "slug": slug.current,
  }`);

export const recipeIngredientReferenceFields = /* groq */ `
  _id,
  "ingredient": ingredient->{
    name,
    type,
  },
  unit,
  percent,
`;

export const recipeQuery =
  defineQuery(`*[_type == "recipe" && slug.current == $slug][0]{
    _id,
    _createdAt,
    _rev,
    title,
    mainImage {
      ${imageFields}
    },
    categories[]->{
      title,
    },
    ingredients[]{
      _type == "reference" => @->{
        "_type": "reference",
        ${recipeIngredientReferenceFields}
      },
      _type == "ingredientGroup" => {
        "_type": "ingredientGroup",
        title,
        ingredients[]->{
          ${recipeIngredientReferenceFields}
        }
      }
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
    ${recipesListFields}
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
