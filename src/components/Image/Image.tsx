import { ComponentProps } from "react";
import NextImage from "next/image";
import { OmitStrict } from "@/utils/types";
import { LazyImage } from "./LazyImage";

type ImageProps = OmitStrict<ComponentProps<typeof NextImage>, "placeholder">;

export const Image = ({ priority, ...props }: ImageProps) => {
  if (priority) {
    return <NextImage {...props} priority />;
  }

  return <LazyImage {...props} />;
};
