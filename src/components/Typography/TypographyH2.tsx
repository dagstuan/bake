import { cn } from "@/lib/utils";
import { TypographyProps } from "./types";

export function TypographyH2({ children, className }: TypographyProps) {
  return (
    <h2
      className={cn(
        "mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0",
        className,
      )}
    >
      {children}
    </h2>
  );
}
