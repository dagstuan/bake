"use client";

import { Fragment } from "react";
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

interface RecipeSidebarProps {
  recipe: NonNullable<RecipeQueryResult>;
}

export const RecipeSidebar = ({ recipe }: RecipeSidebarProps) => {
  const { activeTime, totalTime } = recipe;

  const recipeStore = useRecipeContext();

  const [ingredients, ingredientsGroupOrder, reset] = useStore(
    recipeStore,
    useShallow((s) => [s.ingredients, s.ingredientsGroupOrder, s.reset]),
  );

  const handleReset = () => {
    reset(calcInitialState(recipe));
  };

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
              Tilbakestill
            </Button>
          </div>

          <WakeLockToggle />
        </div>

        <InfoItems activeTime={activeTime} totalTime={totalTime} />
      </Card>

      <Card className="flex flex-col gap-2 rounded-lg p-4">
        <TypographyH3 as="h2">Ingredienser</TypographyH3>

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
