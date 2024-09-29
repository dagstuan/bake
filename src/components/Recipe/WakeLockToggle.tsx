"use client";

import { useState } from "react";
import { useWakeLock } from "react-screen-wake-lock";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";

export const WakeLockToggle = (): JSX.Element | null => {
  const [checked, setChecked] = useState(false);
  const { isSupported, request, release } = useWakeLock({
    onRelease: () => setChecked(false),
  });

  return isSupported ? (
    <div className="flex items-center space-x-3">
      <Label htmlFor="wake-lock-toggle">Behold skjermen på</Label>
      <Switch
        id="wake-lock-toggle"
        checked={checked}
        onCheckedChange={(checked) => {
          setChecked(checked);
          if (checked) {
            request();
          } else {
            release();
          }
        }}
      />
    </div>
  ) : null;
};
