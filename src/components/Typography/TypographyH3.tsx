import { cn } from "@/lib/utils";
import { TypographyProps } from "./types";

export function TypographyH3({ children, className }: TypographyProps) {
  return (
    <h3
      className={cn(
        "mt-8 scroll-m-20 text-2xl font-semibold tracking-tight first:mt-0",
        className,
      )}
    >
      {children}
    </h3>
  );
}
