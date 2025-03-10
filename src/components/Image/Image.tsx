import { ComponentProps } from "react";
import NextImage from "next/image";
import { OmitStrict } from "@/utils/types";
import { LazyImage } from "./LazyImage";
import { cn } from "@/lib/utils";

type ImageProps = OmitStrict<ComponentProps<typeof NextImage>, "placeholder">;

export const Image = ({
  priority,
  className,
  blurDataURL,
  ...props
}: ImageProps) => {
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
      {priority ? (
        <NextImage {...props} priority className={className} />
      ) : (
        <LazyImage {...props} className={className} />
      )}
    </div>
  );
};
