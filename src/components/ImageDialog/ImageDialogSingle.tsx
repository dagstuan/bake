import { RecipeQueryResult } from "../../../sanity.types";
import { ImageDialogContent } from "./ImageDialogContent";
import { Image } from "../Image/Image";
import { urlForImage } from "@/sanity/lib/utils";
import { ImageCaption } from "../ui/image-caption";

export type ImageType = NonNullable<
  NonNullable<RecipeQueryResult>["mainImage"]
>;

const width = 1200;
const height = 800;

interface ImageDialogSingleProps {
  title: string;
  description: string;
  image: ImageType;
}

export const ImageDialogSingle = (props: ImageDialogSingleProps) => {
  const { title, description, image } = props;

  const url =
    urlForImage(image)?.width(width).height(height).fit("max").dpr(2).url() ??
    "";

  return (
    <ImageDialogContent title={title} description={description}>
      <Image
        className="pointer-events-none aspect-3/2 h-full max-h-[90vh] w-full rounded-lg object-cover"
        src={url}
        width={width}
        height={height}
        alt={image.alt ?? "Recipe"}
        blurDataURL={image.asset?.metadata?.lqip ?? undefined}
        sizes="(max-width: 768px) 100vw, 70vw"
      />
      {image.caption && <ImageCaption>{image.caption}</ImageCaption>}
    </ImageDialogContent>
  );
};
