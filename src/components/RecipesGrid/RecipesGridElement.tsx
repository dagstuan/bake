import { cn } from "@/lib/utils";
import { formatDurationShort } from "@/utils/durationUtils";
import { ArrayElement } from "@/utils/types";
import { ClockIcon } from "@radix-ui/react-icons";
import { stegaClean } from "next-sanity";
import Link from "next/link";
import { RecipesListQueryResult } from "../../../sanity.types";
import { Card } from "../ui/card";
import { RecipesGridImage } from "./RecipesGridImage";

interface RecipesGridElementProps {
  recipe: ArrayElement<NonNullable<RecipesListQueryResult>>;
  priority?: boolean;
  "data-sanity"?: string;
  className?: string;
}

export const RecipesGridElement = ({
  recipe,
  priority = false,
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
        <RecipesGridImage image={mainImage} priority={priority} />
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
