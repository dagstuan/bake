"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useWakeLock } from "react-screen-wake-lock";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import useStorage from "@/hooks/useStorage";
import React from "react";
import { literal, union } from "valibot";

const schema = union([literal("true"), literal("false")]);

const isServer = typeof window === "undefined";

export const WakeLockToggle = (): React.JSX.Element | null => {
  const [isClient, setIsClient] = useState(false);
  const hasInitializedStorage = useRef(false);
  const hasClicked = useRef(false);
  const [storageChecked, setStorageChecked] = useStorage<boolean>(
    "wakeLock",
    false,
    schema,
    "localStorage",
  );

  useEffect(() => {
    setIsClient(true);
  }, []);

  const [checked, setChecked] = useState(false);
  const wakeLockActive = useRef(false);

  const { isSupported, request, release } = useWakeLock({
    reacquireOnPageVisible: true,
    onRelease: () => {
      if (isClient) {
        wakeLockActive.current = false;
        setChecked(false);
      }
    },
    onRequest: () => {
      if (isClient) {
        wakeLockActive.current = true;
        setChecked(true);
      }
    },
  });

  const handleCheckedChange = useCallback(
    (checked: boolean) => {
      const effect = async () => {
        if (checked) {
          wakeLockActive.current = true;
          await request();
        } else {
          wakeLockActive.current = false;
          await release();
        }
      };
      effect().catch((err: unknown) => {
        console.log(err);
      });
    },
    [request, release],
  );

  useEffect(() => {
    if (!hasClicked.current) {
      const listener = () => {
        const effect = async () => {
          hasClicked.current = true;
          if (wakeLockActive.current && !checked) {
            await request();
          }
        };
        effect().catch((err: unknown) => {
          console.log(err);
        });
      };

      document.addEventListener("click", listener);

      return () => {
        document.removeEventListener("click", listener);
      };
    }
  }, [checked, request]);

  useEffect(() => {
    const listener = () => {
      const effect = async () => {
        if (
          document.visibilityState === "visible" &&
          wakeLockActive.current &&
          !checked
        ) {
          await request();
        }
      };
      effect().catch((err: unknown) => {
        console.log(err);
      });
    };

    document.addEventListener("visibilitychange", listener);

    return () => {
      document.removeEventListener("visibilitychange", listener);
    };
  }, [checked, request]);

  useEffect(() => {
    if (isClient && !hasInitializedStorage.current) {
      hasInitializedStorage.current = true;
      wakeLockActive.current = storageChecked;
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
    <div className="bg-background flex items-center justify-between rounded-lg border px-4 py-2">
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
