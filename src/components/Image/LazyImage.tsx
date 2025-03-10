"use client";

import { ComponentProps, useState } from "react";
import NextImage from "next/image";
import { cn } from "@/lib/utils";
import { OmitStrict } from "@/utils/types";

type ImageProps = OmitStrict<
  ComponentProps<typeof NextImage>,
  "placeholder" | "priority"
>;

export const LazyImage = ({ blurDataURL, className, ...props }: ImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div
      className={cn(
        "bg-cover bg-center bg-no-repeat text-transparent",
        className,
      )}
      style={{
        backgroundImage: blurDataURL ? `url('${blurDataURL}')` : undefined,
      }}
    >
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
    </div>
  );
};
