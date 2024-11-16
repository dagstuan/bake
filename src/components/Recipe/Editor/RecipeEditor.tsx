"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../../ui/button";
import { useRecipeContext } from "../recipeContext";
import { formatAmount } from "@/utils/recipeUtils";
import { Label } from "@radix-ui/react-label";
import { DeferredNumberInput } from "../DeferredNumberInput";
import { MinusIcon, PlusIcon } from "@radix-ui/react-icons";
import { isDefined } from "@/utils/tsUtils";
import { IngredientEditor } from "./IngredientEditor";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TypographyH4 } from "@/components/Typography/TypographyH4";

type RecipeEditorProps = {
  triggerClassName?: string;
  onReset: () => void;
};

export const RecipeEditor = ({
  onReset,
  triggerClassName,
}: RecipeEditorProps) => {
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

  const handleAllIngredientsToGramClick = () =>
    dispatch({ type: "onAllIngredientsUnitChange", payload: "g" });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className={triggerClassName}>
          Rediger oppskrift
        </Button>
      </DialogTrigger>
      <DialogContent className="my-10 sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Rediger oppskrift</DialogTitle>
          <DialogDescription>
            Her kan du redigere oppskriften. Du kan enten velge å skalere hele
            oppskriften ved å endre på &quot;Antall&quot;, eller skalere en
            enkeltingrediens ved å bruke feltene nedenfor. Hvis du skalerer med
            en enkeltingrediens vil resten av ingrediensene oppdatere seg til å
            passe.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-8 py-4">
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
                className="w-20 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
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
          <div className="border-t pt-8">
            <div className="mb-4 flex items-center justify-between">
              <TypographyH4 as="h3">Ingredienser</TypographyH4>
              <Button
                variant="outline"
                onClick={handleAllIngredientsToGramClick}
              >
                Sett alle til gram
              </Button>
            </div>

            <Table className="w-full">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40%]">Ingrediens</TableHead>
                  <TableHead className="w-[30%]">Mengde</TableHead>
                  <TableHead className="w-[30%]">Enhet</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ingredients
                  .filter((i) => isDefined(i.amount) && isDefined(i.id))
                  .map((ingredient) => (
                    <IngredientEditor
                      key={ingredient.id}
                      ingredient={ingredient}
                    />
                  ))}
              </TableBody>
            </Table>
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
