import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="px-6">
      <div className="prose-lg prose container mx-auto flex max-w-5xl flex-col gap-8 pt-10 sm:pt-16">
        {/* Title skeleton */}
        <Skeleton className="mx-auto h-12 w-64 sm:mb-8" />

        {/* Main Image skeleton */}
        <Skeleton className="flex aspect-1024/400 w-full items-center justify-center rounded-lg" />

        {/* Recipe contents skeleton */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-8">
          <div className="col-span-full flex flex-col gap-6 md:col-span-4 md:gap-8">
            <Skeleton className="h-[500px] w-full" />
          </div>
          <div className="col-span-full align-baseline md:col-span-8">
            <Skeleton className="mb-8 h-10 w-64" />
            <Skeleton className="h-[500px] w-full" />
          </div>
        </div>
      </div>
    </main>
  );
}
