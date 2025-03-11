"use client";

import {
  recipeIngredientReferenceTypeName,
  scalableRecipeNumberTypeName,
} from "@/sanity/schemaTypes/recipe/constants";
import { formatAmount } from "@/utils/recipeUtils";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { ComponentProps } from "react";
import { useStore } from "zustand";
import { useShallow } from "zustand/react/shallow";
import { RecipeQueryResult } from "../../../sanity.types";
import { PortableText } from "../PortableText/PortableText";
import { TypographyH2 } from "../Typography/TypographyH2";
import { TypographyLink } from "../Typography/TypographyLink";
import { TypographyP } from "../Typography/TypographyP";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { useRecipeContext } from "./recipeContext";
import { RecipeIngredientReferenceResult } from "./RecipeIngredientReference";
import { ScalableRecipeNumber } from "./ScalableRecipeNumber";
import {
  RecipeIngredientReference,
  ScalableRecipeNumber as ScalableRecipeNumberType,
} from "./types";

const types: ComponentProps<typeof PortableText>["types"] = {
  [recipeIngredientReferenceTypeName]: ({
    value,
  }: {
    value: RecipeIngredientReference | null | undefined;
  }) => {
    if (!value) return null;

    return <RecipeIngredientReferenceResult value={value} />;
  },
  [scalableRecipeNumberTypeName]: ({
    value,
  }: {
    value: ScalableRecipeNumberType | null | undefined;
  }) => {
    if (!value) return null;

    return <ScalableRecipeNumber value={value} />;
  },
};

const block: ComponentProps<typeof PortableText>["block"] = {
  normal: ({ children }) => (
    <TypographyP className="leading-[1.85rem]">{children}</TypographyP>
  ),
};

interface RecipeTextProps {
  recipe: NonNullable<RecipeQueryResult>;
}

export const RecipeText = ({ recipe }: RecipeTextProps) => {
  const { instructions } = recipe;

  const recipeStore = useRecipeContext();

  const [servings, initialServings] = useStore(
    recipeStore,
    useShallow((s) => [s.servings, s.initialServings]),
  );

  const scaleFactor = 100 * (servings / initialServings);

  return (
    <div className="col-span-full align-baseline md:col-span-1">
      <TypographyH2>Fremgangsmåte</TypographyH2>

      {parseFloat(scaleFactor.toFixed(2)) !== 100 && (
        <Alert className="my-4">
          <InfoCircledIcon />
          <AlertTitle>Skalert oppskrift</AlertTitle>
          <AlertDescription>
            Du har skalert denne oppskriften{" "}
            {scaleFactor > 100 ? "opp til" : "ned til"}{" "}
            {formatAmount(scaleFactor, "%", "0")} av original oppskrift.{" "}
            <TypographyLink type="external" href="mailto:d.stuan@gmail.com">
              Ta kontakt
            </TypographyLink>{" "}
            hvis den skalerte oppskriften ikke gir mening eller noen av
            ingrediensene ikke blir riktig skalert.
          </AlertDescription>
        </Alert>
      )}

      {instructions ? (
        <PortableText value={instructions} block={block} types={types} />
      ) : null}
    </div>
  );
};
