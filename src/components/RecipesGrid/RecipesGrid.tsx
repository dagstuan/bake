import { urlForImage } from "@/sanity/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { AllRecipesQueryResult } from "../../../sanity.types";
import { Card } from "../ui/card";
import { RecipesGridWrapper } from "./RecipesGridWrapper";
import { NoRecipes } from "./NoRecipes";

type RecipesGridProps = {
  recipes: AllRecipesQueryResult;
};

export const RecipesGrid = ({ recipes }: RecipesGridProps) => {
  if (recipes.length === 0) {
    return <NoRecipes />;
  }

  return (
    <RecipesGridWrapper>
      {recipes.map((recipe) => (
        <Link
          href={`/oppskrifter/${recipe.slug?.current}`}
          key={recipe._id}
          className="flex flex-col justify-between"
        >
          <Card className="transition-shadow hover:shadow-md">
            {recipe.mainImage ? (
              <Image
                width={1000}
                height={1000}
                src={
                  urlForImage(recipe.mainImage)
                    ?.height(1000)
                    .width(1000)
                    .url() ?? ""
                }
                alt={recipe.mainImage?.alt ?? "Recipe"}
                className="h-48 w-full rounded-t-lg object-cover"
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
      ))}
    </RecipesGridWrapper>
  );
};
