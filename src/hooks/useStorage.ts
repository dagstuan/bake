"use client";

import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";

export default function useStorage<T>(
  key: string,
  defaultValue: T,
  storage: Storage = window.sessionStorage,
): [T, Dispatch<SetStateAction<T>>] {
  const isMounted = useRef(false);
  const [value, setValue] = useState<T>(defaultValue);

  useEffect(() => {
    try {
      const item = storage.getItem(key);
      if (item) {
        setValue(JSON.parse(item));
      }
    } catch (e) {
      console.log(e);
    }
    return () => {
      isMounted.current = false;
    };
  }, [key, storage]);

  useEffect(() => {
    if (isMounted.current) {
      storage.setItem(key, JSON.stringify(value));
    } else {
      isMounted.current = true;
    }
  }, [key, value, storage]);

  return [value, setValue];
}
