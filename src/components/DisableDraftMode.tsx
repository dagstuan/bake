"use client";

import { useDraftModeEnvironment } from "next-sanity/hooks";

export function DisableDraftMode() {
  const environment = useDraftModeEnvironment();

  // Only show the disable draft mode button when outside of Presentation Tool
  if (environment !== "live" && environment !== "unknown") {
    return null;
  }

  return (
    <a
      className="fixed bottom-0 right-0 m-4 bg-blue-500 p-4 text-white"
      href="/api/draft-mode/disable"
    >
      Disable preview mode
    </a>
  );
}
