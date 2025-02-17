import { isTypedObject } from "sanity";
import { AboutQueryResult } from "../../../sanity.types";
import {
  linkTypeName,
  recipeCardTypeName,
} from "@/sanity/schemaTypes/constants";

type QueriedAbout = NonNullable<NonNullable<AboutQueryResult>["body"]>;

type PortableTextType<T extends QueriedAbout[number]["_type"]> = Extract<
  QueriedAbout[number],
  { _type: T }
>;

export type PortableTextMarkLink = Extract<
  NonNullable<PortableTextType<"block">["markDefs"]>[number],
  { _type: typeof linkTypeName }
>;
export const isPortableTextMarkLink = (
  obj: unknown,
): obj is PortableTextMarkLink => {
  return isTypedObject(obj) && obj._type === linkTypeName;
};

export type RecipeCard = PortableTextType<typeof recipeCardTypeName>;
export const isRecipeCard = (obj: unknown): obj is RecipeCard => {
  return isTypedObject(obj) && obj._type === recipeCardTypeName;
};
