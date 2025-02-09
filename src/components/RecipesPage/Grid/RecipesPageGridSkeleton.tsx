import { Skeleton } from "../../ui/skeleton";

export const RecipesPageGridSkeleton = () => {
  return (
    <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
      {[...(Array(6) as number[])].map((_, i) => (
        <div key={i} className="overflow-hidden rounded-lg border">
          <Skeleton className="aspect-video w-full rounded-t-lg rounded-b-none" />
          <div className="flex justify-between p-4">
            <Skeleton className="h-6 w-2/4" />
            <Skeleton className="h-6 w-1/4" />
          </div>
        </div>
      ))}
    </div>
  );
};
