import { urlForImage } from "@/sanity/lib/utils";
import { isRecipeCard } from "./types";
import { Image } from "../Image/Image";
import { MissingImage } from "../ui/missing-image";
import Link from "next/link";
import { TypographyH4 } from "../Typography/TypographyH4";
import { ClockIcon } from "lucide-react";
import { formatDurationLong } from "@/utils/durationUtils";

interface RecipeCardProps {
  value: unknown;
}

export const RecipeCard = ({ value }: RecipeCardProps) => {
  if (!isRecipeCard(value) || !value.recipe) {
    return null;
  }

  const {
    recipe: { title, mainImage, slug, totalTime },
  } = value;

  const duration = formatDurationLong(totalTime);

  return (
    <Link
      href={`/oppskrifter/${slug}`}
      className="bg-accent dark:bg-secondary dark:hover:bg-muted hover:bg-muted flex gap-4 rounded-2xl p-3 not-first:mt-4 not-last:mb-4"
    >
      <div className="relative size-20 overflow-hidden rounded-xl border-1">
        {mainImage ? (
          <Image
            src={
              urlForImage(mainImage)?.width(80).height(80).fit("crop").url() ??
              ""
            }
            alt={mainImage.alt ?? ""}
            fill
          />
        ) : (
          <MissingImage className="h-full w-full" />
        )}
      </div>

      <div className="flex flex-col gap-1">
        <TypographyH4>{title}</TypographyH4>

        {duration && (
          <div className="text-muted-foreground flex items-center gap-1 text-sm">
            <ClockIcon size={16} /> {duration}
          </div>
        )}
      </div>
    </Link>
  );
};
