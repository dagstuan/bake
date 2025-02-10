import {
  Root as CheckboxPrimitiveRoot,
  Indicator as CheckboxPrimitiveIndicator,
} from "@radix-ui/react-checkbox";
import { CheckIcon, DividerHorizontalIcon } from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";
import { forwardRef } from "react";

const Checkbox = forwardRef<
  React.ComponentRef<typeof CheckboxPrimitiveRoot>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitiveRoot>
>(({ className, checked, ...props }, ref) => (
  <CheckboxPrimitiveRoot
    ref={ref}
    className={cn(
      "peer border-primary focus-visible:ring-ring data-[state=checked]:bg-secondary data-[state=checked]:text-secondary-foreground flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border shadow-sm focus-visible:ring-1 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50 dark:brightness-150",
      className,
    )}
    checked={checked}
    {...props}
  >
    <CheckboxPrimitiveIndicator
      className={cn(
        "flex h-[15px] w-[15px] items-center justify-center text-current",
      )}
    >
      {checked === "indeterminate" && (
        <DividerHorizontalIcon className="h-3 w-3" />
      )}
      {checked === true && (
        <CheckIcon className="h-[15px] w-[15px] translate-y-[0.5px]" />
      )}
    </CheckboxPrimitiveIndicator>
  </CheckboxPrimitiveRoot>
));
Checkbox.displayName = CheckboxPrimitiveRoot.displayName;

export { Checkbox };
