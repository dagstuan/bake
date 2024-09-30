"use client";

import { Fragment, useState } from "react";
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
  onSubmit: (servings: number, ingredients: RecipeIngredientsState) => void;
};

export const RecipeEditorContent = (props: RecipeEditorContentProps) => {
  const {
    servings: initialServings,
    ingredients: initialIngredients,
    yieldPerServing,
    onSubmit,
  } = props;

  const [servings, setServings] = useState(initialServings);
  const [ingredients, setIngredients] = useState(initialIngredients);

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
      const updatedAmount = parseFloat(
        (ingredient.amount * changePercent).toFixed(2),
      );

      return { ...ingredient, amount: updatedAmount };
    });

    setServings(newServings);
    setIngredients(updatedIngredients);
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
    setServings(parseFloat(updatedServings.toFixed(2)));
    setIngredients(updatedIngredients);
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
              onClick={() => handleServingsChange(servings - 1)}
            >
              <MinusIcon />
            </Button>
            <DeferredNumberInput
              id="servings"
              value={servings}
              onChange={handleServingsChange}
              className="w-20"
            />
            <Button
              variant="outline"
              type="button"
              onClick={() => handleServingsChange(servings + 1)}
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
                    value={ingredient.amount}
                    min={0.00001}
                    max={100000}
                    onChange={(newValue) =>
                      handleIngredientChange(ingredient.ingredientId, newValue)
                    }
                    className="w-24"
                  />
                  {ingredient.unit}
                </div>
              </Fragment>
            ))}
          </div>
        </div>
      </div>
      <DialogFooter>
        <Button type="submit" onClick={() => onSubmit(servings, ingredients)}>
          Lagre
        </Button>
      </DialogFooter>
    </>
  );
};
