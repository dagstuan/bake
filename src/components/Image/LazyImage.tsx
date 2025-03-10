"use client";

import { ComponentProps, useState } from "react";
import NextImage from "next/image";
import { cn } from "@/lib/utils";
import { OmitStrict } from "@/utils/types";

type LazyImageProps = OmitStrict<
  ComponentProps<typeof NextImage>,
  "placeholder" | "priority" | "blurDataURL"
>;

export const LazyImage = ({ className, ...props }: LazyImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <NextImage
      {...props}
      className={cn(
        {
          ["opacity-0"]: !isLoaded,
          ["opacity-100"]: isLoaded,
        },
        "transition-opacity",
        className,
      )}
      onLoad={() => {
        setIsLoaded(true);
      }}
    />
  );
};
