import { ComponentPropsWithoutRef, ReactNode, useId } from "react";
import { Highlight } from "./Highlight";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

type CheckedState = boolean | "indeterminate";

type HighlightWithCheckboxProps = Omit<
  ComponentPropsWithoutRef<typeof Checkbox>,
  "checked" | "onCheckedChange"
> & {
  checked?: CheckedState;
  onCheckedChange?: (checked: CheckedState) => void;
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
        <Label
          id={`${checkboxId}-label`}
          htmlFor={checkboxId}
          className="mr-[calc(-14px-0.25rem-0.25rem)] pr-[calc(14px+0.25rem+0.25rem)] pl-1 hover:cursor-pointer"
        >
          {children}
        </Label>
        <Checkbox
          {...rest}
          id={checkboxId}
          checked={checked}
          onCheckedChange={onCheckedChange}
          className={
            "border-accent-foreground h-3.5 w-3.5 rounded-[2px] bg-transparent shadow-xs data-checked:border-transparent data-checked:shadow-none data-indeterminate:border-transparent data-indeterminate:shadow-none"
          }
          nativeButton
          render={
            <button type="button" aria-labelledby={`${checkboxId}-label`} />
          }
        />
      </span>
    </Highlight>
  );
};
