import { ReactNode } from "react";
import { TypographyP } from "../Typography/TypographyP";

interface ImageCaptionProps {
  children: ReactNode;
}

export const ImageCaption = (props: ImageCaptionProps) => {
  return (
    <div className="absolute inset-0 hidden flex-col justify-end px-12 py-8 sm:flex">
      <div className="bg-primary/25 text-primary-foreground dark:bg-secondary/35 max-w-max rounded-2xl px-6 py-4 backdrop-blur-md">
        <TypographyP>{props.children}</TypographyP>
      </div>
    </div>
  );
};
