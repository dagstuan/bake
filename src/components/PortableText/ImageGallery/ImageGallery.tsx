"use client";

import { RecipeQueryResult } from "../../../../sanity.types";
import { urlForImage } from "@/sanity/lib/utils";
import { Dialog, DialogTrigger } from "../../ui/dialog";
import { Image } from "../../Image/Image";
import { ArrayElement } from "@/utils/types";
import dynamic from "next/dynamic";
import { isImageGallery } from "../types";
import { getImageDimensionsForAspectRatio } from "@/utils/imageUtils";

const ImageGalleryContent = dynamic(() =>
  import("./ImageGalleryContent").then((mod) => mod.ImageGalleryContent),
);

export type BlockContentImageGallery = Extract<
  ArrayElement<NonNullable<RecipeQueryResult>["instructions"]>,
  { _type: "imageGallery" }
>;

interface ImageGalleryProps {
  value: unknown;
}

export const ImageGallery = (props: ImageGalleryProps) => {
  if (!isImageGallery(props.value)) {
    return null;
  }

  const { value } = props;

  if (!value.images || value.images.length === 0 || !value.columns) {
    return null;
  }

  const { images, columns } = value;

  const gridCols =
    columns === 1
      ? "grid-cols-1"
      : columns === 2
        ? "grid-cols-2"
        : columns === 3
          ? "grid-cols-3"
          : "grid-cols-4";

  const sizes =
    columns === 1
      ? "(max-width: 768px) 100vw, 50vw"
      : columns === 2
        ? "33vw"
        : columns === 3
          ? "20vw"
          : "15vw";

  const gridSize = columns === 1 ? 700 : columns === 2 ? 350 : 233;

  return (
    <div className={`grid ${gridCols} my-6 gap-4`}>
      {images.map((image, index) => {
        const url = image.asset
          ? urlForImage(image)
              ?.width(gridSize)
              .height(gridSize)
              .fit("crop")
              .auto("format")
              .url()
          : null;

        if (!url) {
          return null;
        }

        return (
          <Dialog key={image.asset?._id ?? index}>
            <DialogTrigger className="cursor-zoom-in transition-shadow hover:shadow-md">
              <Image
                className="pointer-events-none h-full w-full rounded-md object-cover"
                alt={image.alt ?? "image"}
                width={gridSize}
                height={gridSize}
                sizes={sizes}
                src={url}
                loader={({ width }) => {
                  const [calculatedWidth, calculatedHeight] =
                    getImageDimensionsForAspectRatio(width, 1);

                  return (
                    urlForImage(image)
                      ?.width(calculatedWidth)
                      .height(calculatedHeight)
                      .fit("crop")
                      .auto("format")
                      .url() ?? ""
                  );
                }}
                blurDataURL={image.asset?.metadata?.lqip ?? ""}
              />
            </DialogTrigger>
            <ImageGalleryContent images={images} initialIndex={index} />
          </Dialog>
        );
      })}
    </div>
  );
};
