"use client";

import { ComponentProps, useState } from "react";
import NextImage from "next/image";
import { cn } from "@/lib/utils";
import { OmitStrict } from "@/utils/types";

type ImageProps = OmitStrict<ComponentProps<typeof NextImage>, "placeholder">;

export const Image = ({
  alt,
  blurDataURL,
  className,
  priority,
  ...props
}: ImageProps) => {
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
            ["opacity-0"]: !isLoaded && !priority,
            ["opacity-100"]: isLoaded || priority,
          },
          "transition-opacity",
          className,
        )}
        alt={alt}
        onLoad={() => setIsLoaded(true)}
        placeholder={blurDataURL ? "blur" : undefined}
        blurDataURL={blurDataURL}
      />
    </div>
  );
};
