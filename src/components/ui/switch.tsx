import {
  Root as SwitchPrimitiveRoot,
  Thumb as SwitchPrimitiveThumb,
} from "@radix-ui/react-switch";
import { cn } from "@/lib/utils";
import { forwardRef } from "react";

const Switch = forwardRef<
  React.ComponentRef<typeof SwitchPrimitiveRoot>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitiveRoot>
>(({ className, ...props }, ref) => (
  <SwitchPrimitiveRoot
    className={cn(
      "peer focus-visible:ring-ring focus-visible:ring-offset-background data-[state=checked]:bg-primary data-[state=unchecked]:bg-input inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-xs transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50",
      className,
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitiveThumb
      className={cn(
        "bg-background pointer-events-none block h-4 w-4 rounded-full ring-0 shadow-lg transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0",
      )}
    />
  </SwitchPrimitiveRoot>
));
Switch.displayName = SwitchPrimitiveRoot.displayName;

export { Switch };
