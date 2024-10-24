import { type Template } from "sanity";

export const defineTemplate = <TParams, TValue>(
  template: Template<TParams, TValue>,
): Template<TParams, TValue> => template;
