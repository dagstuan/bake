import { useRender } from "@base-ui/react/use-render";
import { cn } from "@/lib/utils";

export function TypographyH3({
  children,
  className,
  render,
}: useRender.ComponentProps<"h3">) {
  return useRender({
    render,
    defaultTagName: "h3",
    props: {
      className: cn(
        "mt-8 scroll-m-20 text-2xl font-semibold tracking-tight first:mt-0",
        className,
      ),
      children,
    },
  });
}
