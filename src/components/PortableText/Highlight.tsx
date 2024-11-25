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
        "inline-block rounded-md border border-gray-200 bg-accent px-1 text-base font-medium leading-6 text-accent-foreground",
        className,
      )}
    >
      {children}
    </span>
  );
};
