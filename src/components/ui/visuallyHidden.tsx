import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export const VisuallyHidden = ({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("sr-only", className)} {...props} />
);

VisuallyHidden.displayName = "VisuallyHidden";
