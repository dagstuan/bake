import { createDataAttribute } from "next-sanity";
import { type Template } from "sanity";
import { dataset, projectId, studioUrl } from "./env";

type Path<T> = string &
  {
    [K in keyof T]: K extends string
      ? NonNullable<T[K]> extends Array<unknown>
        ? K | `${K}[_key==${string}]`
        : K
      : K;
  }[keyof T];

export const defineTemplate = <TParams, TValue>(
  template: Template<TParams, TValue>,
): Template<TParams, TValue> => template;

export const createTypedDataAttribute = <T>(
  documentId: string | undefined,
  documentType: string | undefined,
  path: Path<T>,
): string => {
  return createDataAttribute({
    projectId,
    dataset,
    baseUrl: studioUrl,
    id: documentId,
    type: documentType,
    path,
  }).toString();
};
