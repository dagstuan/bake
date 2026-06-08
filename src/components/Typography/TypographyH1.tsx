import { useRender } from "@base-ui/react/use-render";
import { cn } from "@/lib/utils";

export function TypographyH1({
  children,
  className,
  render,
}: useRender.ComponentProps<"h1">): React.JSX.Element {
  return useRender({
    render,
    defaultTagName: "h1",
    props: {
      className: cn(
        "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
        className,
      ),
      children,
    },
  });
}
