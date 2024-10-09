import { urlForImage } from "@/sanity/lib/utils";
import Link from "next/link";
import { AllRecipesQueryResult } from "../../../sanity.types";
import { Card } from "../ui/card";
import { RecipesGridWrapper } from "./RecipesGridWrapper";
import { NoRecipes } from "./NoRecipes";
import { Image } from "../Image/Image";

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
        return (
          <Link
            href={`/oppskrifter/${recipe.slug?.current}`}
            key={recipe._id}
            className="flex flex-col justify-between"
          >
            <Card className="transition-shadow hover:shadow-md">
              {recipe.mainImage ? (
                <Image
                  width={500}
                  height={300}
                  src={
                    urlForImage(recipe.mainImage.asset?._id)
                      ?.width(500)
                      .height(300)
                      .fit("clip")
                      .url() ?? ""
                  }
                  priority={i <= 3}
                  alt={recipe.mainImage?.alt ?? "Recipe"}
                  className="aspect-video h-48 w-full rounded-t-lg object-cover"
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
              <div className="p-4">
                <h2 className="text-xl font-semibold">{recipe.title}</h2>
              </div>
            </Card>
          </Link>
        );
      })}
    </RecipesGridWrapper>
  );
};
