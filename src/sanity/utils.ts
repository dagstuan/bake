import {
  CreateDataAttribute,
  createDataAttribute,
  CreateDataAttributeProps,
} from "next-sanity";
import { type Template } from "sanity";
import { dataset, projectId, studioUrl } from "./env";

export const defineTemplate = <TParams, TValue>(
  template: Template<TParams, TValue>,
): Template<TParams, TValue> => template;

type TypedDataAttributeProps<T> = Pick<
  Required<CreateDataAttributeProps>,
  "id" | "type"
> & {
  path: string & keyof T;
};

export const createTypedDataAttribute = <T>(
  props: TypedDataAttributeProps<T>,
): CreateDataAttribute<TypedDataAttributeProps<T>> => {
  return createDataAttribute({
    projectId,
    dataset,
    baseUrl: studioUrl,
    ...props,
  });
};

export const hasField = <TFieldName extends string>(
  obj: unknown,
  fieldName: TFieldName,
): obj is Record<TFieldName, unknown> =>
  typeof obj === "object" && obj !== null && fieldName in obj;
