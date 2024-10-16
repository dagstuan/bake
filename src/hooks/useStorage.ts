"use client";

import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";

type StorageType = "localStorage" | "sessionStorage";

export const getStorage = (type: StorageType): Storage =>
  type === "localStorage" ? window.localStorage : window.sessionStorage;

export default function useStorage<T>(
  key: string,
  defaultValue: T,
  storageType: StorageType = "sessionStorage",
): [T, Dispatch<SetStateAction<T>>] {
  const isMounted = useRef(false);
  const [value, setValue] = useState<T>(defaultValue);

  useEffect(() => {
    try {
      const item = getStorage(storageType).getItem(key);
      if (item) {
        setValue(JSON.parse(item));
      }
    } catch (e) {
      console.log(e);
    }
    return () => {
      isMounted.current = false;
    };
  }, [key, storageType]);

  useEffect(() => {
    if (isMounted.current) {
      getStorage(storageType).setItem(key, JSON.stringify(value));
    } else {
      isMounted.current = true;
    }
  }, [key, value, storageType]);

  return [value, setValue];
}
