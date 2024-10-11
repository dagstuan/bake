import Image from "next/image";
import { urlForImage } from "@/sanity/lib/utils";
import { BlockContent } from "../../../sanity.types";
import { ArrayElement } from "@/utils/types";
import { cn } from "@/lib/utils";

export type BlockContentImage = Extract<
  ArrayElement<BlockContent>,
  { _type: "image" }
>;

interface ImageBoxProps {
  image?: BlockContentImage;
  width?: number;
  height?: number;
  size?: string;
  wrapperClasses?: string;
  "data-sanity"?: string;
}

export default function ImageBox({
  image,
  width = 1440,
  height = 820,
  size = "100vw",
  wrapperClasses,
  ...props
}: ImageBoxProps) {
  if (!image) {
    return null;
  }

  const imageUrl = urlForImage(image)?.width(width).dpr(2).fit("max").url();

  return (
    <div
      className={cn(
        "w-full overflow-hidden rounded-[3px] bg-gray-50",
        wrapperClasses,
      )}
      data-sanity={props["data-sanity"]}
    >
      {imageUrl && (
        <Image
          className="max-h-[400px] object-contain"
          alt={image.alt ?? "image"}
          width={width}
          height={height}
          style={{
            width: "100%",
            height: "auto",
          }}
          sizes={size}
          src={imageUrl}
        />
      )}
    </div>
  );
}
