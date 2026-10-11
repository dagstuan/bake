"use client";

import { cn } from "@/lib/utils";
import { formatDurationShort } from "@/utils/durationUtils";
import { Clock3 } from "lucide-react";
import { stegaClean } from "next-sanity";
import Link from "next/link";
import { RecipesListQueryResult } from "../../../sanity.types";
import { Card } from "../ui/card";
import { RecipesGridImage } from "./RecipesGridImage";
import { useRef, ViewTransition } from "react";
import { Get } from "@sanity/codegen";
import type { StegaAware } from "@/sanity/lib/live";
import { cacheRecipeImage } from "./recipeImageCache";

interface RecipesGridElementProps {
  recipe: StegaAware<Get<RecipesListQueryResult, number>>;
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
  const { slug, title, mainImage, totalTime } = recipe;
  const imageRef = useRef<HTMLImageElement>(null);

  const duration = totalTime
    ? formatDurationShort(stegaClean(totalTime))
    : null;

  return (
    <Link
      data-sanity={dataSanity}
      href={`/oppskrifter/${slug}`}
      className={cn("flex flex-col justify-between", className)}
      onNavigate={() => {
        const imageSrc = imageRef.current?.currentSrc;
        if (slug && imageSrc) {
          cacheRecipeImage(stegaClean(slug), imageSrc);
        }
      }}
    >
      <Card className="flex h-full flex-col border-none bg-transparent transition-shadow hover:shadow-md">
        <ViewTransition
          default="recipe-main-image"
          name={`recipe-image-${slug}`}
        >
          <RecipesGridImage
            ref={imageRef}
            image={mainImage}
            priority={priority}
          />
        </ViewTransition>
        <div className="flex h-full items-center justify-between gap-4 p-4">
          <h2 className="text-card-foreground text-xl font-semibold">
            {stegaClean(title)}
          </h2>
          {duration && (
            <div className="text-muted-foreground flex items-center gap-2 text-sm">
              <Clock3 className="h-4 w-4" /> {duration}
            </div>
          )}
        </div>
      </Card>
    </Link>
  );
};
