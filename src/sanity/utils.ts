import { type Template } from "sanity";

export const defineTemplate = <TParams, TValue>(
  template: Template<TParams, TValue>,
): Template<TParams, TValue> => template;

export const hasField = <TFieldName extends string>(
  obj: unknown,
  fieldName: TFieldName,
): obj is Record<TFieldName, unknown> =>
  typeof obj === "object" && obj !== null && fieldName in obj;
