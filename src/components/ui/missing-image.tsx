import { cn } from "@/lib/utils";

export const MissingImage = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        "from-primary/80 to-primary dark:from-primary/40 dark:to-secondary flex aspect-video w-full grow items-center justify-center rounded-t-xl bg-radial-[at_25%_25%] to-75% text-7xl",
        className,
      )}
    ></div>
  );
};
