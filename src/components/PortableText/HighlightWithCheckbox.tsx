import { ComponentPropsWithoutRef, ReactNode, useId } from "react";
import { Highlight } from "./Highlight";
import { cn } from "@/lib/utils";
import * as LabelPrimitive from "@radix-ui/react-label";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { CheckIcon } from "@radix-ui/react-icons";

type HighlightWithCheckboxProps = ComponentPropsWithoutRef<
  typeof CheckboxPrimitive.Root
> & {
  children: ReactNode;
};

export const HighlightWithCheckbox = (props: HighlightWithCheckboxProps) => {
  const { checked, onCheckedChange, children, ...rest } = props;

  const checkboxId = useId();

  return (
    <Highlight
      className={cn(
        "inline-flex items-center justify-center gap-1 pl-0 pr-1 align-baseline focus-within:bg-secondary focus-within:ring-1 focus-within:ring-ring hover:cursor-pointer hover:bg-muted",
        {
          ["bg-muted text-muted-foreground hover:bg-muted"]: checked,
        },
      )}
    >
      <LabelPrimitive.Root
        htmlFor={checkboxId}
        className="mr-[calc(-14px_-_0.25rem_-_0.25rem)] pl-1 pr-[calc(14px_+_0.25rem_+_0.25rem)] hover:cursor-pointer"
      >
        {children}
      </LabelPrimitive.Root>
      <CheckboxPrimitive.Root
        {...rest}
        id={checkboxId}
        checked={checked}
        onCheckedChange={onCheckedChange}
        className={
          "peer flex h-[14px] w-[14px] shrink-0 items-center justify-center rounded-[2px] border border-accent-foreground bg-transparent shadow-sm focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-transparent data-[state=checked]:shadow-none"
        }
      >
        <CheckboxPrimitive.Indicator
          className={cn(
            "flex h-[14px] w-[14px] items-center justify-center text-current",
          )}
        >
          <CheckIcon className="h-[14px] w-[14px]" />
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
    </Highlight>
  );
};
