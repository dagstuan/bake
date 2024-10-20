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
        const duration = formatDurationShort(recipe.totalTime);

        return (
          <Link
            href={`/oppskrifter/${recipe.slug}`}
            key={recipe._id}
            className="flex flex-col justify-between"
          >
            <Card className="transition-shadow hover:shadow-md">
              {recipe.mainImage ? (
                <Image
                  width={500}
                  height={300}
                  src={
                    urlForImage(recipe.mainImage)
                      ?.width(500)
                      .height(300)
                      .fit("clip")
                      .url() ?? ""
                  }
                  priority={i <= 3}
                  alt={recipe.mainImage?.alt ?? "Recipe"}
                  className="aspect-video w-full rounded-t-lg object-cover"
                  blurDataURL={
                    recipe.mainImage?.asset?.metadata?.lqip ?? undefined
                  }
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              ) : (
                <div className="flex w-full flex-grow items-center justify-center text-8xl">
                  🍞
                </div>
              )}
              <div className="flex justify-between p-4">
                <h2 className="text-xl font-semibold">{recipe.title}</h2>
                {duration && (
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <ClockIcon /> {formatDurationShort(recipe.totalTime)}
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
