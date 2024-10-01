"use client";

import { Fragment } from "react";
import {
  maxServings,
  minServings,
  RecipeIngredientsState,
} from "./recipeReducer";
import { Button } from "../ui/button";
import {
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "../ui/dialog";
import { DeferredNumberInput } from "./DeferredNumberInput";
import { Label } from "../ui/label";
import { MinusIcon, PlusIcon } from "@radix-ui/react-icons";

type RecipeEditorContentProps = {
  servings: number;
  yieldPerServing: number;
  ingredients: RecipeIngredientsState;
  onChange: (servings: number, ingredients: RecipeIngredientsState) => void;
  onSave: (servings: number, ingredients: RecipeIngredientsState) => void;
  onReset: () => void;
};

export const RecipeEditorContent = (props: RecipeEditorContentProps) => {
  const { servings, ingredients, yieldPerServing, onChange, onSave, onReset } =
    props;

  const handleServingsChange = (newServings: number) => {
    if (
      newServings === 0 ||
      isNaN(newServings) ||
      newServings < minServings ||
      newServings >= maxServings
    ) {
      return;
    }

    const changePercent = newServings / servings;
    const updatedIngredients = ingredients.map((ingredient) => {
      const updatedAmount = ingredient.amount * changePercent;

      return { ...ingredient, amount: updatedAmount };
    });

    onChange(newServings, updatedIngredients);
  };

  const handleIngredientChange = (ingredientId: string, newAmount: number) => {
    if (newAmount === 0 || isNaN(newAmount)) {
      return;
    }

    const ingredientToUpdate = ingredients.find(
      (ingredient) => ingredient.ingredientId === ingredientId,
    );

    if (!ingredientToUpdate) {
      return;
    }

    const { percent: updatedIngredientPercent } = ingredientToUpdate;

    const updatedIngredients = ingredients.map((ingredient) => {
      if (ingredient.ingredientId === ingredientId) {
        return { ...ingredient, amount: newAmount };
      }

      const updatedAmount = parseFloat(
        ((ingredient.percent / updatedIngredientPercent) * newAmount).toFixed(
          2,
        ),
      );

      return { ...ingredient, amount: updatedAmount };
    });

    const updatedTotalYield = updatedIngredients.reduce(
      (acc, curr) => acc + curr.amount,
      0,
    );

    const updatedServings = updatedTotalYield / yieldPerServing;
    onChange(updatedServings, updatedIngredients);
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>Rediger oppskrift</DialogTitle>
        <DialogDescription>Her kan du redigere oppskriften.</DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="flex items-center gap-4">
          <Label htmlFor="servings" className="text-right">
            Antall
          </Label>
          <div className="col-span-3 flex items-center gap-2">
            <Button
              variant="outline"
              type="button"
              onClick={() => handleServingsChange(Math.ceil(servings - 1))}
            >
              <MinusIcon />
            </Button>
            <DeferredNumberInput
              id="servings"
              value={parseFloat(servings.toFixed(2))}
              onChange={handleServingsChange}
              className="w-20"
            />
            <Button
              variant="outline"
              type="button"
              onClick={() => handleServingsChange(Math.floor(servings + 1))}
            >
              <PlusIcon />
            </Button>
          </div>
        </div>
        <div className="border-t pt-4">
          <h3 className="mb-4 font-medium">Ingredienser</h3>
          <div className="grid grid-cols-[max-content_1fr] items-center gap-4">
            {ingredients.map((ingredient, index) => (
              <Fragment key={index}>
                <Label
                  htmlFor={`ingredient-${index}`}
                  className="text-right text-sm"
                >
                  {ingredient.name}
                </Label>
                <div className="flex items-center gap-2">
                  <DeferredNumberInput
                    id={`ingredient-${index}`}
                    className="w-24"
                    value={parseFloat(ingredient.amount.toFixed(2))}
                    min={0.00001}
                    max={100000}
                    onChange={(newValue) =>
                      handleIngredientChange(ingredient.ingredientId, newValue)
                    }
                  />
                  {ingredient.unit}
                </div>
              </Fragment>
            ))}
          </div>
        </div>
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onReset}>
          Tilbakestill
        </Button>
        <Button type="submit" onClick={() => onSave(servings, ingredients)}>
          Lagre
        </Button>
      </DialogFooter>
    </>
  );
};
