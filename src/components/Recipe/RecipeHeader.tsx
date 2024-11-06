import { RecipeQueryResult } from "../../../sanity.types";
import { TypographyH1 } from "../Typography/TypographyH1";
import { Image } from "../Image/Image";
import { urlForImage } from "@/sanity/lib/utils";

const mainImageWidth = 1024;
const mainImageHeight = 400;

type RQR = NonNullable<RecipeQueryResult>;

type RecipeHeaderProps = {
  title: RQR["title"];
  mainImage: RQR["mainImage"];
};

export const RecipeHeader = ({ title, mainImage }: RecipeHeaderProps) => {
  return (
    <>
      {title ? (
        <TypographyH1 className="text-center sm:mb-8">{title}</TypographyH1>
      ) : null}
      {mainImage ? (
        <Image
          className="w-full rounded-lg"
          src={
            urlForImage(mainImage)
              ?.width(mainImageWidth)
              .height(mainImageHeight)
              .fit("max")
              .dpr(2)
              .url() ?? ""
          }
          width={mainImageWidth}
          height={mainImageHeight}
          alt={mainImage.alt ?? title ?? "Recipe"}
          priority
          blurDataURL={mainImage?.asset?.metadata?.lqip ?? undefined}
          sizes="(max-width: 768px) 100vw, 70vw"
        />
      ) : (
        <div className="flex aspect-[16/3] w-full items-center justify-center rounded-lg bg-secondary text-2xl sm:text-7xl">
          🍞🍰🧑‍🍳
        </div>
      )}
    </>
  );
};
