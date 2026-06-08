import { Popover as PopoverPrimitive } from "@base-ui/react/popover";

import { cn } from "@/lib/utils";
import {
  createContext,
  use,
  useRef,
  type ComponentProps,
  type HTMLAttributes,
  type ReactNode,
} from "react";

type AnchorElement = HTMLElement | null;

const PopoverAnchorContext =
  createContext<React.MutableRefObject<AnchorElement> | null>(null);

function usePopoverAnchorRef() {
  const anchorRef = use(PopoverAnchorContext);

  if (!anchorRef) {
    throw new Error("Popover parts must be used within <Popover />.");
  }

  return anchorRef;
}

const Popover = ({
  children,
  ...props
}: ComponentProps<typeof PopoverPrimitive.Root>) => {
  const anchorRef = useRef<AnchorElement>(null);

  return (
    <PopoverAnchorContext.Provider value={anchorRef}>
      <PopoverPrimitive.Root {...props}>{children}</PopoverPrimitive.Root>
    </PopoverAnchorContext.Provider>
  );
};

const PopoverTrigger = (
  props: ComponentProps<typeof PopoverPrimitive.Trigger>,
) => <PopoverPrimitive.Trigger {...props} />;

interface PopoverAnchorProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
}

const PopoverAnchor = ({
  children,
  className,
  ...props
}: PopoverAnchorProps) => {
  const anchorRef = usePopoverAnchorRef();

  return (
    <div
      ref={(node) => {
        anchorRef.current = node;
      }}
      className={cn(className)}
      {...props}
    >
      {children}
    </div>
  );
};

interface PopoverContentProps
  extends
    ComponentProps<typeof PopoverPrimitive.Popup>,
    Pick<
      ComponentProps<typeof PopoverPrimitive.Positioner>,
      "align" | "alignOffset" | "side" | "sideOffset" | "collisionPadding"
    > {}

const PopoverContent = ({
  className,
  children,
  align = "center",
  sideOffset = 4,
  alignOffset,
  side,
  collisionPadding,
  ...props
}: PopoverContentProps) => {
  const anchorRef = usePopoverAnchorRef();

  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Positioner
        anchor={anchorRef}
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
        collisionPadding={collisionPadding}
      >
        <PopoverPrimitive.Popup
          className={cn(
            "bg-popover text-popover-foreground data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 data-closed:zoom-out-95 data-open:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 w-72 rounded-md border p-4 shadow-lg outline-hidden",
            className,
          )}
          {...props}
        >
          {children}
        </PopoverPrimitive.Popup>
      </PopoverPrimitive.Positioner>
    </PopoverPrimitive.Portal>
  );
};

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor };
