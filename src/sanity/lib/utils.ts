import createImageUrlBuilder from "@sanity/image-url";

import { dataset, projectId } from "../env";
import { ImageUrlBuilder } from "sanity";

const imageBuilder = createImageUrlBuilder({
  projectId: projectId || "",
  dataset: dataset || "",
});

export const urlForImage = (
  imageId: string | null | undefined,
): ImageUrlBuilder | undefined => {
  // Ensure that source image contains a valid reference
  if (!imageId) {
    return undefined;
  }

  return imageBuilder?.image(imageId).auto("format").dpr(2).fit("min");
};
