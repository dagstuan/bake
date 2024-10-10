import { formatAmount } from "@/utils/recipeUtils";
import { useRecipeContext } from "./recipeContext";
import { ScalableRecipeNumber as ScalableRecipeNumberType } from "./types";

type ScalableRecipeNumberProps = {
  value: NonNullable<ScalableRecipeNumberType>;
};

export const ScalableRecipeNumber = (props: ScalableRecipeNumberProps) => {
  const { number = 0, suffix } = props.value;

  const { servings, initialServings } = useRecipeContext();

  return (
    <span className="inline-block rounded-md border border-gray-200 bg-accent px-2 text-base font-[450] leading-6">
      {formatAmount(number * (servings / initialServings))}
      {suffix && ` ${suffix}`}
    </span>
  );
};
