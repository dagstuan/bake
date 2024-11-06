import { DialogContent, DialogDescription, DialogTitle } from "../../ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../../ui/carousel";
import { VisuallyHidden } from "../../ui/visuallyHidden";
import { BlockContentImageGallery } from "./ImageGallery";
import { Image } from "../../Image/Image";
import { urlForImage } from "@/sanity/lib/utils";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";

const imageWidth = 1024;
const imageHeight = 682;

export const ImageGalleryContent = ({
  images,
  initialIndex = 0,
}: {
  images: NonNullable<BlockContentImageGallery["images"]>;
  initialIndex?: number;
}) => {
  return (
    <DialogContent className="max-h-[95vh] w-full p-0 sm:max-w-[60vw] lg:max-w-[70vw]">
      <VisuallyHidden>
        <DialogTitle>Image gallery</DialogTitle>
        <DialogDescription>Description</DialogDescription>
      </VisuallyHidden>
      <Carousel
        opts={{
          loop: true,
          startIndex: initialIndex,
        }}
      >
        <CarouselContent className="-ml-0" tabIndex={0}>
          {images.map((image, index) => {
            const url = urlForImage(image)
              ?.width(imageWidth)
              .height(imageHeight)
              .dpr(2)
              .fit("crop")
              .url();

            return (
              <CarouselItem
                className="select-none pl-0"
                key={image.asset?._id ?? index}
              >
                <AspectRatio
                  ratio={3 / 2}
                  className="overflow-hidden rounded-lg"
                >
                  <Image
                    className="pointer-events-none h-full w-full object-cover"
                    alt={image.alt ?? "image"}
                    width={imageWidth}
                    height={imageHeight}
                    sizes="(max-width: 768px) 100vw, 70vw"
                    src={url!}
                    blurDataURL={image.asset?.metadata?.lqip ?? ""}
                  />
                </AspectRatio>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <CarouselPrevious className="left-4 opacity-50 sm:-left-20 sm:opacity-100" />
        <CarouselNext className="right-4 opacity-50 sm:-right-20 sm:opacity-100" />
      </Carousel>
    </DialogContent>
  );
};
