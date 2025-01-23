import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="px-6">
      <div className="mx-auto mt-8 flex max-w-6xl flex-col gap-12 sm:mt-16">
        {/* Header skeleton */}
        <Skeleton className="mx-auto h-12 w-64" />

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

        {/* Recipe Grid skeleton */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
          {[...(Array(6) as number[])].map((_, i) => (
            <div key={i} className="overflow-hidden rounded-lg border">
              <Skeleton className="aspect-video w-full rounded-b-none rounded-t-lg" />
              <div className="flex justify-between p-4">
                <Skeleton className="h-6 w-2/4" />
                <Skeleton className="h-6 w-1/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
