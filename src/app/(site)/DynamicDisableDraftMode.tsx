"use client";

import dynamic from "next/dynamic";

const DisableDraftMode = dynamic(
  () =>
    import("@/components/DisableDraftMode").then((mod) => mod.DisableDraftMode),
  {
    ssr: false,
  },
);

export const DynamicDisableDraftMode = () => {
  return <DisableDraftMode />;
};
