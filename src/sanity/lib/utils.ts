import createImageUrlBuilder from "@sanity/image-url";

import { dataset, projectId } from "../env";
import { ImageUrlBuilder } from "sanity";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";

const imageBuilder = createImageUrlBuilder({
  projectId: projectId || "",
  dataset: dataset || "",
});

export const urlForImage = (
  imageSource: SanityImageSource | null | undefined,
): ImageUrlBuilder | undefined => {
  // Ensure that source image contains a valid reference
  if (!imageSource) {
    return undefined;
  }

  return imageBuilder?.image(imageSource).auto("format").dpr(2).fit("min");
};
