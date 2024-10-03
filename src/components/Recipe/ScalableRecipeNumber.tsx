import { useRecipeContext } from "./recipeContext";
import { ScalableRecipeNumber as ScalableRecipeNumberType } from "./types";

type ScalableRecipeNumberProps = {
  value: NonNullable<ScalableRecipeNumberType>;
};

export const ScalableRecipeNumber = (props: ScalableRecipeNumberProps) => {
  const { number = 0, suffix } = props.value;

  const { servings, initialServings } = useRecipeContext();

  return (
    <span className="inline-block rounded-md border bg-muted px-2 py-0 text-sm font-medium">
      {number * (servings / initialServings)}
      {suffix && ` ${suffix}`}
    </span>
  );
};
