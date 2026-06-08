import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";
import { type ComponentProps, type ReactNode } from "react";

const Dialog = DialogPrimitive.Root;

const DialogTrigger = (
  props: ComponentProps<typeof DialogPrimitive.Trigger>,
) => <DialogPrimitive.Trigger {...props} />;

const DialogPortal = DialogPrimitive.Portal;

const DialogClose = DialogPrimitive.Close;

interface DialogOverlayProps extends Omit<
  ComponentProps<typeof DialogPrimitive.Backdrop>,
  "children"
> {
  children?: ReactNode;
}

const DialogOverlay = ({
  className,
  children,
  ...props
}: DialogOverlayProps) => (
  <>
    <DialogPrimitive.Backdrop
      className={cn(
        "data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 fixed inset-0 bg-black/80",
        className,
      )}
      {...props}
    />
    <DialogPrimitive.Viewport className="fixed inset-0 grid place-items-center overflow-y-auto p-4">
      {children}
    </DialogPrimitive.Viewport>
  </>
);
DialogOverlay.displayName = "DialogOverlay";

const DialogPopup = ({
  className,
  children,
  ...props
}: ComponentProps<typeof DialogPrimitive.Popup>) => (
  <DialogPrimitive.Popup
    className={cn(
      "bg-background data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 data-closed:zoom-out-95 data-open:zoom-in-95 relative grid w-full gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg",
      className,
    )}
    {...props}
  >
    {children}
  </DialogPrimitive.Popup>
);
DialogPopup.displayName = "DialogPopup";

const DialogContent = ({
  className,
  children,
  ...props
}: ComponentProps<typeof DialogPopup>) => (
  <DialogPortal>
    <DialogOverlay>
      <DialogPopup className={className} {...props}>
        {children}
        <DialogPrimitive.Close className="bg-background ring-offset-background focus:ring-ring absolute top-4 right-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none">
          <X className="h-6 w-6" />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      </DialogPopup>
    </DialogOverlay>
  </DialogPortal>
);
DialogContent.displayName = "DialogContent";

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-4 text-center sm:text-left",
      className,
    )}
    {...props}
  />
);
DialogHeader.displayName = "DialogHeader";

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("flex flex-col gap-2 sm:flex-row sm:justify-end", className)}
    {...props}
  />
);
DialogFooter.displayName = "DialogFooter";

const DialogTitle = ({
  className,
  ...props
}: ComponentProps<typeof DialogPrimitive.Title>) => (
  <DialogPrimitive.Title
    className={cn(
      "text-xl leading-none font-semibold tracking-tight",
      className,
    )}
    {...props}
  />
);
DialogTitle.displayName = "DialogTitle";

const DialogDescription = ({
  className,
  ...props
}: ComponentProps<typeof DialogPrimitive.Description>) => (
  <DialogPrimitive.Description
    className={cn("text-muted-foreground text-base", className)}
    {...props}
  />
);
DialogDescription.displayName = "DialogDescription";

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogPopup,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};
