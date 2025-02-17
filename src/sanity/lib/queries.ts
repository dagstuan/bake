import { defineQuery } from "next-sanity";
import {
  alertTypeName,
  imageGalleryTypeName,
  ingredientTypeName,
  linkTypeName,
  recipeCardTypeName,
} from "../schemaTypes/constants";
import {
  ingredientGroupTypeName,
  recipeIngredientReferenceTypeName,
  recipeTypeName,
} from "../schemaTypes/recipe/constants";

const imageFields = /* groq */ `
  hotspot,
  crop,
  alt,
  caption,
  asset->{
    _id,
    metadata {
      lqip
    }
  }`;

export const linkFields = /* groq */ `
  linkType,
  href,
  internalReference->{
    _type,
    "slug": slug.current,
  },
`;

export const blockMarkDefsFields = /* groq */ `
  ...,
  _type == "${linkTypeName}" => {
    ${linkFields}
  }
`;

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

export const allRecipesSlugQuery =
  defineQuery(`*[_type == "recipe" && visible == true]
  {
    "slug": slug.current,
  }`);

export const recipesListQuery = defineQuery(`*[
  _type == "${recipeTypeName}" &&
  visible == true &&
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
    _type,
    _type == "${ingredientTypeName}" => {
      name,
      weights,
      conversions[] {
        to->{
          name,
          weights,
        },
        rate,
      }
    },
    _type == "${recipeTypeName}" => {
      title,
      "slug": slug.current,
    }
  },
  unit,
  percent,
  comment,
  excludeFromTotalYield,
`;

export const recipeCardFields = /* groq */ `
  recipe->{
    _id,
    title,
    "slug": slug.current,
    mainImage {
      ${imageFields}
    },
    totalTime
  },
`;

const basePortableTextFields = /* groq */ `
  _key,
  _type,
  _type == "image" => {
    ${imageFields}
  },
  _type == "${alertTypeName}" => {
    variant,
    title,
    body[] {
      ...,
      markDefs[] {
        ${blockMarkDefsFields}
      }
    },
  },
  _type == "${imageGalleryTypeName}" => {
    ...,
    images[] {
      ${imageFields},
      caption
    }
  },
  _type == "${recipeCardTypeName}" => {
    ${recipeCardFields}
  }
`;

export const recipeQuery =
  defineQuery(`*[_type == "${recipeTypeName}" && slug.current == $slug][0]{
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
      _type == "${ingredientGroupTypeName}" => {
        "_type": "ingredientGroup",
        _type,
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
      _type == "block" => {
        ...,
        children[]{
          ...,
          _type == "${recipeIngredientReferenceTypeName}" => {
            ...,
            "ingredient": @.ingredient->{
              _id,
              ingredient->{
                _type == "${ingredientTypeName}" => {
                  name,
                },
                _type == "${recipeTypeName}" => {
                  "name": title,
                }
              },
              percent,
              unit,
            },
          },
        },
        markDefs[] {
          ${blockMarkDefsFields}
        }
      },
      ${basePortableTextFields}
    },
    seo
}`);

export const pageSlugQuery = defineQuery(`*[_id == $pageId][0]{
  _type,
  "slug": slug.current,
}`);

export const homePageQuery = defineQuery(`*[_type == "home"][0]{
  _id,
  _type,
  subtitle,
  recipes[]{
    _key,
    ...(@->{
      ${recipesListFields}
    })
  },
}`);

export const aboutQuery = defineQuery(`*[_type == "about"][0]{
  title,
  body[] {
    _type == "block" => {
      ...,
      markDefs[] {
        ${blockMarkDefsFields}
      }
    },
    ${basePortableTextFields}
  },
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

export const recipesSitemapQuery =
  defineQuery(`*[_type == "recipe" && visible == true] {
  ${sitemapFields}
}`);

export const homeSeoQuery = defineQuery(`*[_type == "home"][0]{
  seo
}`);

export const allIngredientsQuery = defineQuery(`*[_type == "ingredient"]`);
