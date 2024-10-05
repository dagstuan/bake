"use client";

import { Fragment, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { useRecipeContext } from "./recipeContext";
import { formatAmount } from "@/utils/recipeUtils";
import { Label } from "@radix-ui/react-label";
import { DeferredNumberInput } from "./DeferredNumberInput";
import { MinusIcon, PlusIcon } from "@radix-ui/react-icons";

type RecipeEditorProps = {
  onReset: () => void;
};

export const RecipeEditor = ({ onReset }: RecipeEditorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { servings, ingredients, dispatch } = useRecipeContext();

  const handleSave = () => {
    setIsOpen(false);
  };

  const handleServingsChange = (newServings: number) =>
    dispatch({
      type: "onServingsChange",
      payload: newServings,
    });

  const handleIngredientChange = (ingredientId: string, newAmount: number) => {
    dispatch({
      type: "onIngredientChange",
      payload: {
        ingredientId,
        newAmount,
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="default">Rediger oppskrift</Button>
      </DialogTrigger>
      <DialogContent className="my-10 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Rediger oppskrift</DialogTitle>
          <DialogDescription>
            Her kan du redigere oppskriften. Du kan enten velge å skalere hele
            oppskriften ved å endre på "Antall", eller skalere en
            enkeltingrediens ved å bruke feltene nedenfor. Hvis du skalerer med
            en enkeltingrediens vil resten av ingrediensene oppdatere seg til å
            passe.
          </DialogDescription>
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
                value={parseFloat(formatAmount(servings))}
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
                      value={parseFloat(formatAmount(ingredient.amount))}
                      min={0.00001}
                      max={100000}
                      onChange={(newValue) =>
                        handleIngredientChange(
                          ingredient.ingredientId,
                          newValue,
                        )
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
          <Button type="submit" onClick={handleSave}>
            Lagre
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
