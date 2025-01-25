import { cn } from "@/lib/utils";
import { urlForImage } from "@/sanity/lib/utils";
import { formatDurationShort } from "@/utils/durationUtils";
import { ArrayElement } from "@/utils/types";
import { ClockIcon } from "@radix-ui/react-icons";
import { stegaClean } from "next-sanity";
import Link from "next/link";
import { RecipesListQueryResult } from "../../../sanity.types";
import { Image } from "../Image/Image";
import { Card } from "../ui/card";

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
      <Card className="flex h-full flex-col transition-shadow hover:shadow-md">
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
          <div className="from-primary/80 to-primary dark:from-primary/40 dark:to-secondary flex aspect-video w-full grow items-center justify-center rounded-t-xl bg-radial-[at_25%_25%] to-75% text-7xl"></div>
        )}
        <div className="flex h-full items-center justify-between p-4">
          <h2 className="text-card-foreground text-xl font-semibold">
            {stegaClean(title)}
          </h2>
          {duration && (
            <div className="text-muted-foreground flex items-center gap-2 text-sm">
              <ClockIcon /> {duration}
            </div>
          )}
        </div>
      </Card>
    </Link>
  );
};
