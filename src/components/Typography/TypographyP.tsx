import { cn } from "@/lib/utils";
import { TypographyProps } from "./types";

export function TypographyP({ children, className }: TypographyProps) {
  return (
    <p
      className={cn(
        "text-pretty leading-7 not-first:mt-2 not-last:mb-4",
        className,
      )}
    >
      {children}
    </p>
  );
}
