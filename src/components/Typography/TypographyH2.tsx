import { useRender } from "@base-ui/react/use-render";
import { cn } from "@/lib/utils";

export function TypographyH2({
  children,
  className,
  render,
}: useRender.ComponentProps<"h2">) {
  return useRender({
    render,
    defaultTagName: "h2",
    props: {
      className: cn(
        "mt-10 mb-4 scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0",
        className,
      ),
      children,
    },
  });
}
