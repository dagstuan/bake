import { cn } from "@/lib/utils";
import { TypographyProps } from "./types";

export function TypographyP({ children, className }: TypographyProps) {
  return (
    <p
      className={cn(
        "leading-7 [&:not(:first-child)]:mt-2 [&:not(:last-child)]:mb-4",
        className,
      )}
    >
      {children}
    </p>
  );
}
