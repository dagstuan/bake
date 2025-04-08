import {
  Root as DialogPrimitiveRoot,
  Trigger as DialogPrimitiveTrigger,
  Portal as DialogPrimitivePortal,
  Close as DialogPrimitiveClose,
  Overlay as DialogPrimitiveOverlay,
  Content as DialogPrimitiveContent,
  Title as DialogPrimitiveTitle,
  Description as DialogPrimitiveDescription,
} from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";
import { forwardRef } from "react";

const Dialog = DialogPrimitiveRoot;

const DialogTrigger = DialogPrimitiveTrigger;

const DialogPortal = DialogPrimitivePortal;

const DialogClose = DialogPrimitiveClose;

const DialogOverlay = forwardRef<
  React.ComponentRef<typeof DialogPrimitiveOverlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitiveOverlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitiveOverlay
    ref={ref}
    className={cn(
      "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 top-0 right-0 bottom-0 left-0 z-50 grid place-items-center overflow-y-auto bg-black/80",
      className,
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitiveOverlay.displayName;

const DialogContent = forwardRef<
  React.ComponentRef<typeof DialogPrimitiveContent>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitiveContent>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay>
      <DialogPrimitiveContent
        ref={ref}
        className={cn(
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 relative z-50 grid w-full gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg",
          className,
        )}
        {...props}
      >
        {children}
        <DialogPrimitiveClose className="bg-background ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none">
          <Cross2Icon className="h-6 w-6" />
          <span className="sr-only">Close</span>
        </DialogPrimitiveClose>
      </DialogPrimitiveContent>
    </DialogOverlay>
  </DialogPortal>
));
DialogContent.displayName = DialogPrimitiveContent.displayName;

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

const DialogTitle = forwardRef<
  React.ComponentRef<typeof DialogPrimitiveTitle>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitiveTitle>
>(({ className, ...props }, ref) => (
  <DialogPrimitiveTitle
    ref={ref}
    className={cn(
      "text-xl leading-none font-semibold tracking-tight",
      className,
    )}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitiveTitle.displayName;

const DialogDescription = forwardRef<
  React.ComponentRef<typeof DialogPrimitiveDescription>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitiveDescription>
>(({ className, ...props }, ref) => (
  <DialogPrimitiveDescription
    ref={ref}
    className={cn("text-muted-foreground text-base", className)}
    {...props}
  />
));
DialogDescription.displayName = DialogPrimitiveDescription.displayName;

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};
