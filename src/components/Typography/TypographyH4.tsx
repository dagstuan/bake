import { useRender } from "@base-ui/react/use-render";
import { cn } from "@/lib/utils";

export function TypographyH4({
  children,
  className,
  render,
}: useRender.ComponentProps<"h4">): React.JSX.Element {
  return useRender({
    render,
    defaultTagName: "h4",
    props: {
      className: cn(
        "mt-6 scroll-m-20 text-xl font-semibold tracking-tight first:mt-0",
        className,
      ),
      children,
    },
  });
}
