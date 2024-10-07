import { Skeleton } from "../ui/skeleton";
import { RecipesGridWrapper } from "./RecipesGridWrapper";

const RecipeSkeleton = () => (
  <div className="flex flex-col space-y-3">
    <Skeleton className="h-[200px] w-full rounded-xl" />
    <div className="space-y-2">
      <Skeleton className="h-4 w-[250px]" />
      <Skeleton className="h-4 w-[200px]" />
    </div>
  </div>
);

export const RecipesGridSkeleton = () => {
  return (
    <RecipesGridWrapper>
      <RecipeSkeleton />
      <RecipeSkeleton />
      <RecipeSkeleton />
    </RecipesGridWrapper>
  );
};
