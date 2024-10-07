import { useRecipeContext } from "./recipeContext";
import { ScalableRecipeNumber as ScalableRecipeNumberType } from "./types";

type ScalableRecipeNumberProps = {
  value: NonNullable<ScalableRecipeNumberType>;
};

export const ScalableRecipeNumber = (props: ScalableRecipeNumberProps) => {
  const { number = 0, suffix } = props.value;

  const { servings, initialServings } = useRecipeContext();

  return (
    <span className="inline-block rounded-md bg-muted px-2 text-base font-medium leading-6">
      {number * (servings / initialServings)}
      {suffix && ` ${suffix}`}
    </span>
  );
};
