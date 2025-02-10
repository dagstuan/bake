import { ComponentPropsWithoutRef, ReactNode, useId } from "react";
import { Highlight } from "./Highlight";
import { cn } from "@/lib/utils";
import { Root as LabelPrimitiveRoot } from "@radix-ui/react-label";
import {
  Root as CheckboxPrimitiveRoot,
  Indicator as CheckboxPrimitiveIndicator,
} from "@radix-ui/react-checkbox";
import { CheckIcon } from "@radix-ui/react-icons";

type HighlightWithCheckboxProps = ComponentPropsWithoutRef<
  typeof CheckboxPrimitiveRoot
> & {
  children: ReactNode;
};

export const HighlightWithCheckbox = (props: HighlightWithCheckboxProps) => {
  const { checked, onCheckedChange, children, ...rest } = props;

  const checkboxId = useId();

  return (
    <Highlight
      className={cn(
        "focus-within:bg-muted focus-within:ring-muted-foreground hover:bg-muted-foreground/20 dark:hover:bg-muted-foreground/25 pr-1 pl-0 align-baseline focus-within:ring-1 hover:cursor-pointer",
        {
          ["bg-muted text-muted-foreground hover:bg-secondary"]: checked,
        },
      )}
    >
      <span className="inline-flex items-center justify-center gap-1">
        <LabelPrimitiveRoot
          htmlFor={checkboxId}
          className="mr-[calc(-14px_-_0.25rem_-_0.25rem)] pr-[calc(14px_+_0.25rem_+_0.25rem)] pl-1 hover:cursor-pointer"
        >
          {children}
        </LabelPrimitiveRoot>
        <CheckboxPrimitiveRoot
          {...rest}
          id={checkboxId}
          checked={checked}
          onCheckedChange={onCheckedChange}
          className={
            "peer border-accent-foreground flex h-[14px] w-[14px] shrink-0 items-center justify-center rounded-[2px] border bg-transparent shadow-xs focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-transparent data-[state=checked]:shadow-none"
          }
        >
          <CheckboxPrimitiveIndicator
            className={cn(
              "flex h-[14px] w-[14px] items-center justify-center text-current",
            )}
          >
            <CheckIcon className="h-[14px] w-[14px]" />
          </CheckboxPrimitiveIndicator>
        </CheckboxPrimitiveRoot>
      </span>
    </Highlight>
  );
};
