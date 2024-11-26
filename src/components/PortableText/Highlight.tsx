import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface HighlightProps {
  children: ReactNode;
  className?: string;
}

export const Highlight = ({ children, className }: HighlightProps) => {
  return (
    <span
      className={cn(
        "inline-block rounded-md border bg-secondary px-1 text-base font-medium leading-6 text-secondary-foreground",
        className,
      )}
    >
      {children}
    </span>
  );
};
