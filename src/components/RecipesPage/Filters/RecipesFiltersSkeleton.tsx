import { Skeleton } from "../../ui/skeleton";

export const RecipesFiltersSkeleton = () => {
  return (
    <div className="flex w-full flex-col items-center gap-4 overflow-hidden sm:gap-6">
      {/* Search Bar skeleton */}
      <div className="w-full max-w-3xl">
        <Skeleton className="h-10 w-full rounded-lg" />
      </div>

      {/* Categories skeleton */}
      <div className="mx-auto flex justify-center gap-2 overflow-x-auto">
        {[...(Array(8) as number[])].map((_, i) => (
          <Skeleton key={i} className="h-8 w-20 shrink-0 rounded-md" />
        ))}
      </div>
    </div>
  );
};
