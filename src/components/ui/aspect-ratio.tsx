import { cn } from "@/lib/utils";

interface AspectRatioProps extends React.HTMLAttributes<HTMLDivElement> {
  ratio?: number;
}

export const AspectRatio = ({
  className,
  ratio = 1,
  style,
  ...props
}: AspectRatioProps) => (
  <div
    className={cn(className)}
    style={{
      ...style,
      aspectRatio: ratio,
    }}
    {...props}
  />
);
AspectRatio.displayName = "AspectRatio";
