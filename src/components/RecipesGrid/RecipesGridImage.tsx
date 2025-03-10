"use client";

import { ArrayElement } from "@/utils/types";
import { RecipesListQueryResult } from "../../../sanity.types";
import { Image } from "../Image/Image";
import { urlForImage } from "@/sanity/lib/utils";
import { getImageDimensionsForAspectRatio } from "@/utils/imageUtils";
import { stegaClean } from "next-sanity";

const gridImageWidth = 360;
const gridImageHeight = 202;
const aspectRatio = gridImageWidth / gridImageHeight;

interface RecipesGridImageProps {
  image: ArrayElement<NonNullable<RecipesListQueryResult>>["mainImage"];
  priority: boolean;
}

export const RecipesGridImage = ({
  image,
  priority,
}: RecipesGridImageProps) => {
  return image ? (
    <Image
      width={gridImageWidth}
      height={gridImageHeight}
      src={
        urlForImage(image)
          ?.width(gridImageWidth)
          .height(gridImageHeight)
          .fit("max")
          .url() ?? ""
      }
      loader={({ width }) => {
        const [calculatedWidth, calculatedHeight] =
          getImageDimensionsForAspectRatio(width, aspectRatio);

        return (
          urlForImage(image)
            ?.width(calculatedWidth)
            .height(calculatedHeight)
            .fit("crop")
            .url() ?? ""
        );
      }}
      priority={priority}
      alt={stegaClean(image.alt ?? "Recipe")}
      className="aspect-video w-full rounded-t-xl object-cover"
      blurDataURL={image.asset?.metadata?.lqip ?? undefined}
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 30vw"
    />
  ) : (
    <div className="from-primary/80 to-primary dark:from-primary/40 dark:to-secondary flex aspect-video w-full grow items-center justify-center rounded-t-xl bg-radial-[at_25%_25%] to-75% text-7xl"></div>
  );
};
