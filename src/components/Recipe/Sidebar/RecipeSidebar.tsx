"use client";

import { Fragment, useId, useMemo } from "react";
import { useStore } from "zustand";
import { useShallow } from "zustand/react/shallow";
import { RecipeQueryResult } from "../../../../sanity.types";
import { TypographyH3 } from "../../Typography/TypographyH3";
import { TypographyH4 } from "../../Typography/TypographyH4";
import { Button } from "../../ui/button";
import { Card } from "../../ui/card";
import { InfoItems } from "../InfoItems";
import { IngredientsTable } from "../IngredientsTable";
import { useRecipeContext } from "../recipeContext";
import { calcInitialState } from "../store/initialState";
import { WakeLockToggle } from "../WakeLockToggle";
import { RecipeEditor } from "../Editor/RecipeEditor";
import { Switch } from "../../ui/switch";
import { Label } from "../../ui/label";

interface RecipeSidebarProps {
  recipe: NonNullable<RecipeQueryResult>;
}

export const RecipeSidebar = ({ recipe }: RecipeSidebarProps) => {
  const { activeTime, totalTime } = recipe;

  const recipeStore = useRecipeContext();
  const [
    ingredients,
    ingredientsGroupOrder,
    reset,
    convertAllToGrams,
    restoreOriginalUnits,
    ingredientsOriginalUnits,
  ] = useStore(
    recipeStore,
    useShallow((s) => [
      s.ingredients,
      s.ingredientsGroupOrder,
      s.reset,
      s.convertAllToGrams,
      s.restoreOriginalUnits,
      s.ingredientsOriginalUnits,
    ]),
  );

  const ingredientsWithUnit = ingredients.filter(
    (i) => i.type === "ingredient" && i.unit,
  );

  const isAllIngredientsInGrams =
    ingredientsWithUnit.length > 0 &&
    ingredientsWithUnit.every((i) => i.unit === "g");

  const shouldShowGramsToggle = useMemo(
    () => Object.values(ingredientsOriginalUnits).some((unit) => unit !== "g"),
    [ingredientsOriginalUnits],
  );

  const handleReset = () => {
    reset(calcInitialState(recipe));
  };

  const ingredientsGramToggleId = useId();

  return (
    <div className="col-span-full flex flex-col gap-6 md:col-span-1">
      <Card className="flex flex-col gap-6 rounded-lg p-4">
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap gap-2">
            <RecipeEditor onReset={handleReset} triggerClassName="flex-1" />
            <Button
              className="flex-1"
              type="button"
              variant="outline"
              onClick={handleReset}
            >
              Tilbakestill endringer
            </Button>
          </div>

          <WakeLockToggle />
        </div>

        <InfoItems activeTime={activeTime} totalTime={totalTime} />
      </Card>

      <Card className="flex flex-col gap-2 rounded-lg p-4">
        <div className="flex items-center justify-between gap-4">
          <TypographyH3 as="h2" className="m-0">
            Ingredienser
          </TypographyH3>
          {shouldShowGramsToggle && (
            <div className="flex items-center gap-2">
              <Label
                htmlFor={ingredientsGramToggleId}
                className="text-xs font-normal"
                title="Vis alle mengder i gram"
              >
                Gram
              </Label>
              <Switch
                id={ingredientsGramToggleId}
                checked={isAllIngredientsInGrams}
                title={
                  isAllIngredientsInGrams
                    ? "Viser mengder i gram. Klikk for å vise original enhet."
                    : "Viser originale enheter. Klikk for å vise i gram."
                }
                onCheckedChange={(checked) => {
                  if (checked) {
                    convertAllToGrams();
                  } else {
                    restoreOriginalUnits();
                  }
                }}
              />
            </div>
          )}
        </div>

        <IngredientsTable
          group={null}
          ingredients={ingredients.filter((i) => !i.group)}
        />

        {ingredientsGroupOrder.map((group) => {
          const groupIngredients = ingredients.filter((i) => i.group === group);

          if (groupIngredients.length === 0) return null;

          return (
            <Fragment key={group}>
              <TypographyH4 as="h3">{group}</TypographyH4>
              <IngredientsTable group={group} ingredients={groupIngredients} />
            </Fragment>
          );
        })}
      </Card>
    </div>
  );
};
