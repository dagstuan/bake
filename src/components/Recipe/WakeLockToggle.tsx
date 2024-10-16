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
  const [storageChecked, setStorageChecked] = useStorage<boolean>(
    "wakeLock",
    false,
    "localStorage",
  );

  useEffect(() => {
    setIsClient(true);
  }, []);

  const [checked, setChecked] = useState(false);

  const { isSupported, request, release } = useWakeLock({
    onRelease: () => setChecked(false),
    onRequest: () => setChecked(true),
  });

  const handleCheckedChange = useCallback(
    (checked: boolean) => {
      if (checked) {
        request();
      } else {
        release();
      }
    },
    [request, release],
  );

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
    <div className="flex items-center space-x-3">
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
