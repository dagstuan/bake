"use client";

import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { BaseIssue, BaseSchema, safeParse } from "valibot";

type StorageType = "localStorage" | "sessionStorage";

export const getStorage = (type: StorageType): Storage =>
  type === "localStorage" ? window.localStorage : window.sessionStorage;

export default function useStorage<T>(
  key: string,
  defaultValue: T,
  schema: BaseSchema<unknown, unknown, BaseIssue<unknown>>,
  storageType: StorageType = "sessionStorage",
): [T, Dispatch<SetStateAction<T>>] {
  const isMounted = useRef(false);
  const [value, setValue] = useState<T>(() => {
    // Skip storage access during SSR
    if (typeof window === "undefined") {
      return defaultValue;
    }

    try {
      const item = getStorage(storageType).getItem(key);
      const parsed = safeParse(schema, item);
      if (item && parsed.success) {
        return JSON.parse(item) as T;
      }
    } catch (e) {
      console.log(e);
    }
    return defaultValue;
  });

  useEffect(() => {
    // Skip storage access during SSR
    if (typeof window === "undefined") {
      return;
    }

    if (isMounted.current) {
      getStorage(storageType).setItem(key, JSON.stringify(value));
    } else {
      isMounted.current = true;
    }
  }, [key, value, storageType]);

  return [value, setValue];
}
