import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../../ui/carousel";
import { BlockContentImageGallery } from "./ImageGallery";
import { Image } from "../../Image/Image";
import { urlForImage } from "@/sanity/lib/utils";
import { ImageDialogContent } from "../../ImageDialog/ImageDialogContent";

const imageWidth = 1200;
const imageHeight = 800;

export const ImageGalleryContent = ({
  images,
  initialIndex = 0,
}: {
  images: NonNullable<BlockContentImageGallery["images"]>;
  initialIndex?: number;
}) => {
  return (
    <ImageDialogContent
      title="Bildegalleri"
      description="Flere bilder av matrett"
    >
      <Carousel
        opts={{
          loop: true,
          startIndex: initialIndex,
        }}
      >
        <CarouselContent tabIndex={0} className="focus:outline-none">
          {images.map((image, index) => {
            const url = urlForImage(image)
              ?.width(imageWidth)
              .height(imageHeight)
              .dpr(2)
              .fit("max")
              .url();

            return (
              <CarouselItem
                className="select-none"
                key={image.asset?._id ?? index}
              >
                <Image
                  className="pointer-events-none aspect-[3/2] h-full max-h-[90vh] w-full rounded-lg object-cover"
                  alt={image.alt ?? "image"}
                  width={imageWidth}
                  height={imageHeight}
                  sizes="(max-width: 768px) 100vw, 70vw"
                  src={url ?? ""}
                  blurDataURL={image.asset?.metadata?.lqip ?? ""}
                />
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <CarouselPrevious className="left-4 opacity-40 md:-left-12 md:opacity-100 lg:-left-16" />
        <CarouselNext className="right-4 opacity-40 md:-right-12 md:opacity-100 lg:-right-16" />
      </Carousel>
    </ImageDialogContent>
  );
};
