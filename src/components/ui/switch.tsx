import { Switch as SwitchPrimitive } from "@base-ui/react/switch";
import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

type SwitchProps = ComponentProps<typeof SwitchPrimitive.Root>;

const Switch = ({ className, ...props }: SwitchProps) => (
  <SwitchPrimitive.Root
    className={cn(
      "peer focus-visible:ring-ring focus-visible:ring-offset-background data-checked:bg-primary data-unchecked:bg-input inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-xs transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50",
      className,
    )}
    {...props}
  >
    <SwitchPrimitive.Thumb
      className={cn(
        "bg-background pointer-events-none block h-4 w-4 rounded-full shadow-lg ring-0 transition-transform data-checked:translate-x-4 data-unchecked:translate-x-0",
      )}
    />
  </SwitchPrimitive.Root>
);
Switch.displayName = "Switch";

export { Switch };
