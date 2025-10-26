"use client";

import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { urlForImage } from "@/sanity/lib/utils";
import dynamic from "next/dynamic";
import { ComponentProps } from "react";
import { Image } from "../../Image/Image";
import { RecipeHeader } from "./RecipeHeader";
import { getImageDimensionsForAspectRatio } from "@/utils/imageUtils";
import { ViewTransition } from "react";

const ImageDialogSingle = dynamic(() =>
  import("@/components/ImageDialog/ImageDialogSingle").then(
    (mod) => mod.ImageDialogSingle,
  ),
);

export interface MainImageProps {
  slug: string;
  mainImage: ComponentProps<typeof RecipeHeader>["mainImage"];
}

const mainImageWidth = 1024;
const mainImageHeight = 400;
const aspectRatio = mainImageWidth / mainImageHeight;

export const MainImage = ({ mainImage, slug }: MainImageProps) => {
  if (!mainImage) {
    return null;
  }

  return (
    <Dialog>
      <DialogTrigger>
        <ViewTransition name={`recipe-image-${slug}`}>
          <Image
            className="w-full cursor-zoom-in rounded-lg"
            src={
              urlForImage(mainImage)
                ?.width(mainImageWidth)
                .height(mainImageHeight)
                .fit("max")
                .url() ?? ""
            }
            loader={({ width }) => {
              const [calculatedWidth, calculatedHeight] =
                getImageDimensionsForAspectRatio(width, aspectRatio);

              return (
                urlForImage(mainImage)
                  ?.width(calculatedWidth)
                  .height(calculatedHeight)
                  .fit("crop")
                  .url() ?? ""
              );
            }}
            width={mainImageWidth}
            height={mainImageHeight}
            alt={mainImage.alt ?? "Hovedbilde"}
            priority
            blurDataURL={mainImage.asset?.metadata?.lqip ?? undefined}
            sizes="(max-width: 768px) 100vw, 70vw"
          />
        </ViewTransition>
      </DialogTrigger>
      <ImageDialogSingle
        image={mainImage}
        title="Main image"
        description={mainImage.alt ?? ""}
      />
    </Dialog>
  );
};
