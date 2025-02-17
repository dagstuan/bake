import { urlForImage } from "@/sanity/lib/utils";
import { RecipeQueryResult } from "../../../sanity.types";
import { ArrayElement } from "@/utils/types";
import { cn } from "@/lib/utils";
import { AspectRatio } from "../ui/aspect-ratio";
import { Dialog, DialogTrigger } from "../ui/dialog";
import { Image } from "../Image/Image";
import dynamic from "next/dynamic";
import { isPortableTextImage } from "./types";

const ImageDialogSingle = dynamic(() =>
  import("../ImageDialog/ImageDialogSingle").then(
    (mod) => mod.ImageDialogSingle,
  ),
);

export type BlockContentImage = Extract<
  ArrayElement<NonNullable<RecipeQueryResult>["instructions"]>,
  { _type: "image" }
>;

interface ImageBoxProps {
  image?: unknown;
  className?: string;
  width?: number;
  height?: number;
  size?: string;
  "data-sanity"?: string;
}

export default function ImageBox({
  image,
  className,
  width = 1024,
  height = 682,
  ...props
}: ImageBoxProps) {
  if (!isPortableTextImage(image)) {
    return null;
  }

  const imageUrl = urlForImage(image)
    ?.width(width)
    .height(height)
    .dpr(2)
    .fit("max")
    .url();

  if (!imageUrl) {
    return null;
  }

  return (
    <Dialog>
      <DialogTrigger
        tabIndex={0}
        className="my-6 block aspect-3/2 w-full cursor-zoom-in space-y-2 transition-shadow hover:shadow-md"
      >
        <AspectRatio
          ratio={3 / 2}
          className={cn("w-full overflow-hidden rounded-md", className)}
          data-sanity={props["data-sanity"]}
        >
          {imageUrl && (
            <Image
              className="pointer-events-none h-full w-full object-cover"
              alt={image.alt ?? "image"}
              width={width}
              height={height}
              sizes="(max-width: 768px) 90vw, 50vw"
              src={imageUrl}
              blurDataURL={image.asset?.metadata?.lqip ?? ""}
            />
          )}
        </AspectRatio>
      </DialogTrigger>
      <ImageDialogSingle
        image={image}
        title="Bilde"
        description={image.alt ?? "Bilde av matrett"}
      />
    </Dialog>
  );
}
