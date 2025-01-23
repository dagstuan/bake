import { urlForImage } from "@/sanity/lib/utils";
import { title } from "process";
import { Image } from "../../Image/Image";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { ComponentProps } from "react";
import { RecipeHeader } from "./RecipeHeader";
import dynamic from "next/dynamic";

const ImageDialogSingle = dynamic(() =>
  import("@/components/ImageDialog/ImageDialogSingle").then(
    (mod) => mod.ImageDialogSingle,
  ),
);

export interface MainImageProps {
  mainImage: ComponentProps<typeof RecipeHeader>["mainImage"];
}

const mainImageWidth = 1024;
const mainImageHeight = 400;

export const MainImage = ({ mainImage }: MainImageProps) => {
  if (!mainImage) {
    return (
      <div className="flex aspect-16/3 w-full items-center justify-center rounded-lg bg-secondary text-2xl sm:text-7xl">
        🍞🍰🧑‍🍳
      </div>
    );
  }

  return (
    <Dialog>
      <DialogTrigger>
        <Image
          className="w-full cursor-zoom-in rounded-lg"
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
          alt={mainImage.alt ?? title}
          priority={true}
          blurDataURL={mainImage.asset?.metadata?.lqip ?? undefined}
          sizes="(max-width: 768px) 100vw, 70vw"
        />
      </DialogTrigger>
      <ImageDialogSingle
        image={mainImage}
        title="Main image"
        description={mainImage.alt ?? ""}
      />
    </Dialog>
  );
};
