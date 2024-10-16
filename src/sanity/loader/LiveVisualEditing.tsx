"use client";

import { useLiveMode } from "@sanity/react-loader";
import { VisualEditing } from "next-sanity";
import { getClient } from "../lib/client";

const stegaClient = getClient().withConfig({ stega: true });

export default function LiveVisualEditing(): JSX.Element {
  useLiveMode({ client: stegaClient });

  return <VisualEditing />;
}
