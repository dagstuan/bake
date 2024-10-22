import { urlForImage } from "@/sanity/lib/utils";
import Link from "next/link";
import { AllRecipesQueryResult } from "../../../sanity.types";
import { Card } from "../ui/card";
import { RecipesGridWrapper } from "./RecipesGridWrapper";
import { NoRecipes } from "./NoRecipes";
import { Image } from "../Image/Image";
import { ClockIcon } from "@radix-ui/react-icons";
import { formatDurationShort } from "@/utils/durationUtils";

type RecipesGridProps = {
  recipes: AllRecipesQueryResult;
};

export const RecipesGrid = ({ recipes }: RecipesGridProps) => {
  if (recipes.length === 0) {
    return <NoRecipes />;
  }

  return (
    <RecipesGridWrapper>
      {recipes.map((recipe, i) => {
        const { _id, slug, title, mainImage, totalTime } = recipe;

        const duration = formatDurationShort(totalTime);

        return (
          <Link
            prefetch
            href={`/oppskrifter/${slug}`}
            key={_id}
            className="flex flex-col justify-between"
          >
            <Card className="transition-shadow hover:shadow-md">
              {mainImage ? (
                <Image
                  width={500}
                  height={300}
                  src={
                    urlForImage(mainImage)
                      ?.width(500)
                      .height(300)
                      .fit("clip")
                      .url() ?? ""
                  }
                  priority={i < 3}
                  alt={mainImage?.alt ?? "Recipe"}
                  className="aspect-video w-full rounded-t-lg object-cover"
                  blurDataURL={mainImage?.asset?.metadata?.lqip ?? undefined}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              ) : (
                <div className="flex aspect-video w-full flex-grow items-center justify-center bg-secondary text-7xl">
                  🍞
                </div>
              )}
              <div className="flex justify-between p-4">
                <h2 className="text-xl font-semibold">{title}</h2>
                {duration && (
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <ClockIcon /> {duration}
                  </div>
                )}
              </div>
            </Card>
          </Link>
        );
      })}
    </RecipesGridWrapper>
  );
};
