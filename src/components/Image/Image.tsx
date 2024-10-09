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
          "transition-opacity",
          {
            ["opacity-0"]: !isLoaded && blurDataURL,
            ["opacity-100"]: isLoaded || !blurDataURL,
          },
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
