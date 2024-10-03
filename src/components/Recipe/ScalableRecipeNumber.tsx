import { useRecipeContext } from "./recipeContext";
import { ScalableRecipeNumber as ScalableRecipeNumberType } from "./types";

type ScalableRecipeNumberProps = {
  value: NonNullable<ScalableRecipeNumberType>;
};

export const ScalableRecipeNumber = (props: ScalableRecipeNumberProps) => {
  const { number = 0 } = props.value;

  const { servings, initialServings } = useRecipeContext();

  return (
    <span className="h-6 rounded-md bg-muted px-2 text-sm font-medium">
      {number * (servings / initialServings)}
    </span>
  );
};
