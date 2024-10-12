import { formatAmount } from "@/utils/recipeUtils";
import { useRecipeContext } from "./recipeContext";
import { ScalableRecipeNumber as ScalableRecipeNumberType } from "./types";
import { Highlight } from "../PortableText/Highlight";

type ScalableRecipeNumberProps = {
  value: NonNullable<ScalableRecipeNumberType>;
};

export const ScalableRecipeNumber = (props: ScalableRecipeNumberProps) => {
  const { number = 0, suffix } = props.value;

  const { servings, initialServings } = useRecipeContext();

  return (
    <Highlight>
      {formatAmount(number * (servings / initialServings))}
      {suffix && ` ${suffix}`}
    </Highlight>
  );
};
