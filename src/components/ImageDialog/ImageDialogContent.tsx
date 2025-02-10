import {
  DialogClose,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from "../ui/dialog";
import { Content as DialogPrimitiveContent } from "@radix-ui/react-dialog";
import { VisuallyHidden } from "../ui/visuallyHidden";
import { Cross2Icon } from "@radix-ui/react-icons";

interface ImageDialogContentProps {
  children: React.ReactNode;
  title: string;
  description: string;
}

export const ImageDialogContent = (props: ImageDialogContentProps) => {
  const { children, title, description } = props;

  return (
    <DialogPortal>
      <DialogOverlay>
        <DialogPrimitiveContent className="relative w-full shadow-xl md:max-w-[80vw]">
          <VisuallyHidden>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </VisuallyHidden>
          {children}
          <DialogClose className="bg-background ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-foreground absolute top-4 right-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none">
            <Cross2Icon className="h-6 w-6" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogPrimitiveContent>
      </DialogOverlay>
    </DialogPortal>
  );
};
