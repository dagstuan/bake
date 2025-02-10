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
        "bg-secondary text-secondary-foreground inline-block rounded-md border px-1 text-base leading-6 font-medium",
        className,
      )}
    >
      {children}
    </span>
  );
};
