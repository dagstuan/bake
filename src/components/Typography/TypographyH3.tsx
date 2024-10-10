import { cn } from "@/lib/utils";
import { TypographyProps } from "./types";

export function TypographyH3({ as, children, className }: TypographyProps) {
  const Tag = as ? as : "h3";

  return (
    <Tag
      className={cn(
        "mt-8 scroll-m-20 text-2xl font-semibold tracking-tight first:mt-0",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
