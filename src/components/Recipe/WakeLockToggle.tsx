"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useWakeLock } from "react-screen-wake-lock";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import useStorage from "@/hooks/useStorage";

const isServer = typeof window === "undefined";

export const WakeLockToggle = (): JSX.Element | null => {
  const [isClient, setIsClient] = useState(false);
  const hasInitializedStorage = useRef(false);
  const hasClicked = useRef(false);
  const [storageChecked, setStorageChecked] = useStorage<boolean>(
    "wakeLock",
    false,
    "localStorage",
  );

  useEffect(() => {
    setIsClient(true);
  }, []);

  const [checked, setChecked] = useState(false);
  const wakeLockActive = useRef(false);

  const { isSupported, request, release } = useWakeLock({
    onRelease: () => setChecked(false),
    onRequest: () => setChecked(true),
  });

  const handleCheckedChange = useCallback(
    (checked: boolean) => {
      if (checked) {
        wakeLockActive.current = true;
        request();
      } else {
        wakeLockActive.current = false;
        release();
      }
    },
    [request, release],
  );

  useEffect(() => {
    if (!hasClicked.current) {
      const listener = () => {
        hasClicked.current = true;
        if (wakeLockActive.current && !checked) {
          request();
        }
      };

      document.addEventListener("click", listener);

      return () => {
        document.removeEventListener("click", listener);
      };
    }
  }, [checked, request]);

  useEffect(() => {
    const listener = () => {
      if (
        document.visibilityState === "visible" &&
        wakeLockActive.current &&
        !checked
      ) {
        request();
      }
    };

    document.addEventListener("visibilitychange", listener);

    return () => {
      document.removeEventListener("visibilitychange", listener);
    };
  }, [checked, request]);

  useEffect(() => {
    if (isClient && !hasInitializedStorage.current) {
      hasInitializedStorage.current = true;
      if (storageChecked !== checked) {
        handleCheckedChange(storageChecked);
      }
    }
  }, [checked, isClient, storageChecked, handleCheckedChange]);

  useEffect(() => {
    if (
      isClient &&
      hasInitializedStorage.current &&
      storageChecked !== checked
    ) {
      setStorageChecked(checked);
    }
  }, [checked, isClient, setStorageChecked, storageChecked]);

  return (
    <div className="flex items-center justify-between rounded-lg bg-white p-4">
      <Label htmlFor="wake-lock-toggle">Behold skjermen på</Label>
      <Switch
        id="wake-lock-toggle"
        disabled={!isServer && !isSupported}
        checked={checked}
        title="Behold skjermen på"
        onCheckedChange={handleCheckedChange}
      />
    </div>
  );
};
