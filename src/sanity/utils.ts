import { createDataAttribute } from "next-sanity";
import { type Template } from "sanity";
import { dataset, projectId, studioUrl } from "./env";

type Path<T> = string &
  {
    [K in keyof T]: K extends string
      ? NonNullable<T[K]> extends unknown[]
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
  // eslint-disable-next-line @typescript-eslint/no-base-to-string
  return createDataAttribute({
    projectId,
    dataset,
    baseUrl: studioUrl,
    id: documentId,
    type: documentType,
    path,
  }).toString();
};

export const hasField = <TFieldName extends string>(
  obj: unknown,
  fieldName: TFieldName,
): obj is Record<TFieldName, unknown> =>
  typeof obj === "object" && obj !== null && fieldName in obj;
