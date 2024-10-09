"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { CheckIcon } from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";

const RecipeIngredientReferenceCheckbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "peer flex h-[14px] w-[14px] shrink-0 items-center justify-center rounded-[2px] border border-accent-foreground bg-transparent shadow-sm focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-transparent",
      className,
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn(
        "flex h-[14px] w-[14px] items-center justify-center text-current",
      )}
    >
      <CheckIcon className="h-[14px] w-[14px]" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
RecipeIngredientReferenceCheckbox.displayName =
  CheckboxPrimitive.Root.displayName;

export { RecipeIngredientReferenceCheckbox };
