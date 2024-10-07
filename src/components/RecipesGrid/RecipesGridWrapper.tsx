import { ReactNode } from "react";

type RecipesGridWrapperProps = {
  children: ReactNode;
};

export const RecipesGridWrapper = (props: RecipesGridWrapperProps) => {
  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
      {props.children}
    </div>
  );
};
