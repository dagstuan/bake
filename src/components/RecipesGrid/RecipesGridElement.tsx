import { urlForImage } from "@/sanity/lib/utils";
import Link from "next/link";
import { Card } from "../ui/card";
import { Image } from "../Image/Image";
import { ClockIcon } from "@radix-ui/react-icons";
import { RecipesListQueryResult } from "../../../sanity.types";
import { ArrayElement } from "@/utils/types";
import { formatDurationShort } from "@/utils/durationUtils";
import { cn } from "@/lib/utils";
import { stegaClean } from "next-sanity";

const gridImageWidth = 360;
const gridImageHeight = 202;

interface RecipesGridElementProps {
  recipe: ArrayElement<NonNullable<RecipesListQueryResult>>;
  prority?: boolean;
  "data-sanity"?: string;
  className?: string;
}

export const RecipesGridElement = ({
  recipe,
  prority,
  "data-sanity": dataSanity,
  className,
}: RecipesGridElementProps) => {
  const { _id, slug, title, mainImage, totalTime } = recipe;

  const duration = formatDurationShort(totalTime);

  return (
    <Link
      data-sanity={dataSanity}
      href={`/oppskrifter/${slug}`}
      key={_id}
      className={cn("flex flex-col justify-between", className)}
    >
      <Card className="transition-shadow hover:shadow-md">
        {mainImage ? (
          <Image
            width={gridImageWidth}
            height={gridImageHeight}
            src={
              urlForImage(mainImage)
                ?.width(gridImageWidth)
                .height(gridImageHeight)
                .fit("max")
                .dpr(2)
                .url() ?? ""
            }
            priority={prority}
            alt={stegaClean(mainImage.alt ?? "Recipe")}
            className="aspect-video w-full rounded-t-xl object-cover"
            blurDataURL={mainImage.asset?.metadata?.lqip ?? undefined}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 30vw"
          />
        ) : (
          <div className="flex aspect-video w-full flex-grow items-center justify-center bg-secondary text-7xl">
            🍞
          </div>
        )}
        <div className="flex justify-between p-4">
          <h2 className="text-xl font-semibold text-card-foreground">
            {stegaClean(title)}
          </h2>
          {duration && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <ClockIcon /> {duration}
            </div>
          )}
        </div>
      </Card>
    </Link>
  );
};
