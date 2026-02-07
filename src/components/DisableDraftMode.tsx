"use client";

import { useVisualEditingEnvironment } from "next-sanity/hooks";

export function DisableDraftMode() {
  const veEnv = useVisualEditingEnvironment();

  // Only show the disable draft mode button when outside of Presentation Tool
  if (veEnv !== "standalone") {
    return null;
  }

  return (
    <a
      className="fixed right-0 bottom-0 m-4 bg-blue-500 p-4 text-white"
      href="/api/draft-mode/disable"
    >
      Disable preview mode
    </a>
  );
}
