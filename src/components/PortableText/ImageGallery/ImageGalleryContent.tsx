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
import { TypographyP } from "@/components/Typography/TypographyP";

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
        <CarouselContent tabIndex={0} className="focus:outline-hidden">
          {images.map((image, index) => {
            const url = image.asset
              ? urlForImage(image)
                  ?.width(imageWidth)
                  .height(imageHeight)
                  .dpr(2)
                  .fit("max")
                  .url()
              : null;

            if (!url) {
              return null;
            }

            return (
              <CarouselItem
                className="relative select-none"
                key={image.asset?._id ?? index}
              >
                <Image
                  className="pointer-events-none aspect-3/2 h-full max-h-[90vh] w-full rounded-lg object-cover"
                  alt={image.alt ?? "image"}
                  width={imageWidth}
                  height={imageHeight}
                  sizes="(max-width: 768px) 100vw, 70vw"
                  src={url}
                  blurDataURL={image.asset?.metadata?.lqip ?? ""}
                />
                {image.caption && (
                  <div className="absolute inset-0 hidden flex-col justify-end px-12 py-8 sm:flex">
                    <div className="max-w-max rounded-2xl bg-primary/25 px-6 py-4 text-primary-foreground backdrop-blur-md dark:bg-secondary/35">
                      <TypographyP>{image.caption}</TypographyP>
                    </div>
                  </div>
                )}
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
