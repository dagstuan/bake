import { urlForImage } from "@/sanity/lib/utils";
import { RecipeQueryResult } from "../../../sanity.types";
import { ArrayElement } from "@/utils/types";
import { cn } from "@/lib/utils";
import { AspectRatio } from "../ui/aspect-ratio";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { VisuallyHidden } from "../ui/visuallyHidden";
import { Image } from "../Image/Image";

export type BlockContentImage = Extract<
  ArrayElement<NonNullable<RecipeQueryResult>["instructions"]>,
  { _type: "image" }
>;

interface ImageBoxProps {
  image?: BlockContentImage;
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
  if (!image) {
    return null;
  }

  const imageUrl = urlForImage(image)?.width(width).dpr(2).fit("crop").url();

  if (!imageUrl) {
    return null;
  }

  return (
    <Dialog>
      <DialogTrigger
        tabIndex={0}
        className="my-6 block aspect-[3/2] w-full cursor-zoom-in space-y-2"
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
      <DialogContent className="aspect-[3/2] w-full max-w-full p-0 sm:max-w-[70vw]">
        <VisuallyHidden>
          <DialogTitle>Image</DialogTitle>
          <DialogDescription>Description</DialogDescription>
        </VisuallyHidden>
        <div className="h-full w-full overflow-hidden rounded-lg">
          <Image
            className="pointer-events-none h-full w-full object-cover"
            alt={image.alt ?? "image"}
            width={width}
            height={height}
            sizes="(max-width: 768px) 100vw, 70vw"
            src={imageUrl}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
