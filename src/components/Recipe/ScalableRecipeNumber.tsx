"use client";

import { formatAmount } from "@/utils/recipeUtils";
import { useRecipeContext } from "./recipeContext";
import { ScalableRecipeNumber as ScalableRecipeNumberType } from "./types";
import { Highlight } from "../PortableText/Highlight";
import { useStore } from "zustand";

type ScalableRecipeNumberProps = {
  value: NonNullable<ScalableRecipeNumberType>;
};

export const ScalableRecipeNumber = (props: ScalableRecipeNumberProps) => {
  const { number = 0, suffix } = props.value;

  const recipeStore = useRecipeContext();
  const servings = useStore(recipeStore, (s) => s.servings);
  const initialServings = useStore(recipeStore, (s) => s.initialServings);

  return (
    <Highlight>
      {formatAmount(number * (servings / initialServings))}
      {suffix && ` ${suffix}`}
    </Highlight>
  );
};
