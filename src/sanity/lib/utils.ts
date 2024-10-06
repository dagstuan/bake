import createImageUrlBuilder from "@sanity/image-url";

import { dataset, projectId } from "../env";
import { FrontPageRecipesQueryResult } from "../../../sanity.types";
import { ArrayElement } from "@/utils/types";

type ImageReference = ArrayElement<FrontPageRecipesQueryResult>["mainImage"];

const imageBuilder = createImageUrlBuilder({
  projectId: projectId || "",
  dataset: dataset || "",
});

export const urlForImage = (source: ImageReference) => {
  // Ensure that source image contains a valid reference
  if (!source?.asset?._ref) {
    return undefined;
  }

  return imageBuilder?.image(source).auto("format").fit("max");
};
