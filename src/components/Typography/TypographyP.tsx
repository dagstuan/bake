import { useRender } from "@base-ui/react/use-render";
import { cn } from "@/lib/utils";

export function TypographyP({
  children,
  className,
  render,
}: useRender.ComponentProps<"p">) {
  return useRender({
    render,
    defaultTagName: "p",
    props: {
      className: cn(
        "leading-7 text-pretty not-first:mt-2 not-last:mb-4",
        className,
      ),
      children,
    },
  });
}
