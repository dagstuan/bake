import { isTypedObject } from "sanity";
import { AboutQueryResult } from "../../../sanity.types";
import {
  alertTypeName,
  imageGalleryTypeName,
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

export type PortableTextAlert = PortableTextType<typeof alertTypeName>;
export const isPortableTextAlert = (obj: unknown): obj is PortableTextAlert => {
  return isTypedObject(obj) && obj._type === alertTypeName;
};

export type ImageGallery = PortableTextType<typeof imageGalleryTypeName>;
export const isImageGallery = (obj: unknown): obj is ImageGallery => {
  return isTypedObject(obj) && obj._type === imageGalleryTypeName;
};

export type PortableTextImage = PortableTextType<"image">;
export const isPortableTextImage = (obj: unknown): obj is PortableTextImage => {
  return isTypedObject(obj) && obj._type === "image";
};
