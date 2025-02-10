import { cn } from "@/lib/utils";
import { TypographyProps } from "./types";

export function TypographyH2({ children, className }: TypographyProps) {
  return (
    <h2
      className={cn(
        "mt-10 mb-4 scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0",
        className,
      )}
    >
      {children}
    </h2>
  );
}
