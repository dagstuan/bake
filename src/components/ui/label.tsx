import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const labelVariants = cva(
  "text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
);

const Label = ({
  className,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement> &
  VariantProps<typeof labelVariants>) => (
  <label className={cn(labelVariants(), className)} {...props} />
);
Label.displayName = "Label";

export { Label };
