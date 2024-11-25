import { cn } from "@/lib/utils";
import { TypographyProps } from "./types";

export function TypographyH4({
  children,
  className,
}: TypographyProps): React.JSX.Element {
  return (
    <h4
      className={cn(
        "mt-6 scroll-m-20 text-xl font-semibold tracking-tight first:mt-0",
        className,
      )}
    >
      {children}
    </h4>
  );
}
