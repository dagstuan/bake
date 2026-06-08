import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox";
import { Check, Minus } from "lucide-react";

import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

type CheckedState = boolean | "indeterminate";

interface CheckboxProps extends Omit<
  ComponentProps<typeof CheckboxPrimitive.Root>,
  "checked" | "defaultChecked" | "indeterminate" | "onCheckedChange"
> {
  checked?: CheckedState;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: CheckedState) => void;
}

const Checkbox = ({
  className,
  checked,
  defaultChecked,
  onCheckedChange,
  ...props
}: CheckboxProps) => (
  <CheckboxPrimitive.Root
    className={cn(
      "peer border-primary focus-visible:ring-ring data-checked:bg-secondary data-checked:text-secondary-foreground data-indeterminate:bg-secondary data-indeterminate:text-secondary-foreground flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border shadow-sm focus-visible:ring-1 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50 dark:brightness-150",
      className,
    )}
    checked={checked === true}
    defaultChecked={defaultChecked}
    indeterminate={checked === "indeterminate"}
    onCheckedChange={onCheckedChange}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      keepMounted
      className={cn(
        "flex h-3.75 w-3.75 items-center justify-center text-current",
      )}
    >
      {checked === "indeterminate" && <Minus className="h-3 w-3" />}
      {checked === true && <Check className="translate-y-px/2 h-3.75 w-3.75" />}
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
);
Checkbox.displayName = "Checkbox";

export { Checkbox };
