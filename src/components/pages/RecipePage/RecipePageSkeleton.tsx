"use client";

import { useParams } from "next/navigation";
import { ViewTransition } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { getCachedRecipeImage } from "@/components/RecipesGrid/recipeImageCache";

export const RecipePageSkeleton = () => {
  // The skeleton is part of the shared App Shell, so read the slug on the
  // client. Naming the image placeholder like the recipe image lets the grid
  // image morph into it, and it into the real image once the recipe loads.
  const { slug } = useParams<{ slug: string }>();
  const imageSrc = getCachedRecipeImage(slug);

  return (
    <main className="px-6">
      <div className="container mx-auto flex max-w-5xl flex-col gap-8 pt-10 sm:pt-16">
        <Skeleton className="mx-auto h-10 w-2/3 sm:mb-8 lg:h-12" />
        <ViewTransition
          default="recipe-main-image"
          name={`recipe-image-${slug}`}
        >
          {imageSrc ? (
            // The exact file the recipe card loaded, so it comes from the
            // browser cache. next/image would request a different size.
            // eslint-disable-next-line next/no-img-element
            <img
              src={imageSrc}
              alt=""
              className="aspect-1024/400 w-full rounded-lg object-cover"
            />
          ) : (
            <Skeleton className="aspect-1024/400 w-full rounded-lg" />
          )}
        </ViewTransition>
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[minmax(320px,1fr)_3fr] md:gap-8">
          <Skeleton className="h-96 w-full rounded-xl" />
          <div className="flex flex-col gap-4">
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      </div>
    </main>
  );
};
