import {
  DialogClose,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogPopup,
  DialogTitle,
} from "../ui/dialog";
import { VisuallyHidden } from "../ui/visuallyHidden";
import { X } from "lucide-react";

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
        <DialogPopup className="relative w-full border-none bg-transparent p-0 shadow-xl md:max-w-[80vw]">
          <VisuallyHidden>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </VisuallyHidden>
          {children}
          <DialogClose className="bg-background ring-offset-background focus:ring-ring absolute top-4 right-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none">
            <X className="h-6 w-6" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogPopup>
      </DialogOverlay>
    </DialogPortal>
  );
};
