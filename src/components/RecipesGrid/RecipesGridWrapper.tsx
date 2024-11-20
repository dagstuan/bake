import { cn } from "@/lib/utils";
import { ReactNode } from "react";

type RecipesGridWrapperProps = {
  children: ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

export const RecipesGridWrapper = (props: RecipesGridWrapperProps) => {
  const { children, className, ...rest } = props;

  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
};
