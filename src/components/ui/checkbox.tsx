"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { CheckIcon, DividerHorizontalIcon } from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, checked, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "peer flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border border-primary shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-secondary data-[state=checked]:text-secondary-foreground",
      className,
    )}
    checked={checked}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn(
        "flex h-[15px] w-[15px] items-center justify-center text-current",
      )}
    >
      {checked === "indeterminate" && (
        <DividerHorizontalIcon className="h-3 w-3" />
      )}
      {checked === true && <CheckIcon className="h-[15px] w-[15px]" />}
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
