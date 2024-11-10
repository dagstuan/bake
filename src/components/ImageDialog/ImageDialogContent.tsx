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

type ImageDialogContentProps = {
  children: React.ReactNode;
  title: string;
  description: string;
};

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
          <DialogClose className="absolute right-4 top-4 rounded-sm bg-white opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <Cross2Icon className="h-6 w-6" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogPrimitiveContent>
      </DialogOverlay>
    </DialogPortal>
  );
};
