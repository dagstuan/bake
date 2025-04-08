"use client";

import { CakeSliceIcon } from "@/components/icons/CakeSliceIcon";
import { TypographyH4 } from "@/components/Typography/TypographyH4";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatAmount } from "@/utils/recipeUtils";
import { isDefined } from "@/utils/tsUtils";
import { MinusIcon, PlusIcon } from "@radix-ui/react-icons";
import { Label } from "@radix-ui/react-label";
import { Weight } from "lucide-react";
import { useState } from "react";
import { useStore } from "zustand";
import { useShallow } from "zustand/react/shallow";
import { Button } from "../../ui/button";
import { DeferredNumberInput } from "../DeferredNumberInput";
import { useRecipeContext } from "../recipeContext";
import { IngredientEditor } from "./IngredientEditor";

interface RecipeEditorProps {
  triggerClassName?: string;
  onReset: () => void;
}

export const RecipeEditor = ({
  onReset,
  triggerClassName,
}: RecipeEditorProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const recipeStore = useRecipeContext();

  const [
    servings,
    ingredients,
    totalYield,
    onServingsChange,
    onTotalYieldChange,
    onAllIngredientsUnitChange,
  ] = useStore(
    recipeStore,
    useShallow((s) => [
      s.servings,
      s.ingredients,
      s.totalYield,
      s.onServingsChange,
      s.onTotalYieldChange,
      s.onAllIngredientsUnitChange,
    ]),
  );

  const handleSave = () => {
    setIsOpen(false);
  };

  const handleAllIngredientsToGramClick = () => {
    onAllIngredientsUnitChange("g");
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className={triggerClassName}>
          Rediger oppskrift
        </Button>
      </DialogTrigger>
      <DialogContent className="my-10 max-w-full sm:max-w-lg">
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
          <div className="grid grid-cols-[minmax(100px,_max-content)_1fr] items-center gap-4">
            <Label
              htmlFor="servings"
              className="flex items-center gap-2 overflow-hidden text-nowrap text-ellipsis"
            >
              <CakeSliceIcon />{" "}
              <span className="overflow-hidden text-nowrap text-ellipsis">
                Antall porsjoner
              </span>
            </Label>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                type="button"
                className="p-3 sm:p-4"
                onClick={() => {
                  onServingsChange(Math.ceil(servings - 1));
                }}
              >
                <MinusIcon />
              </Button>
              <DeferredNumberInput
                id="servings"
                value={parseFloat(formatAmount(servings))}
                min={0}
                onChange={onServingsChange}
                className="w-20 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />
              <Button
                variant="outline"
                type="button"
                className="p-3 sm:p-4"
                onClick={() => {
                  onServingsChange(Math.floor(servings + 1));
                }}
              >
                <PlusIcon />
              </Button>
            </div>
            <Label htmlFor="totalYield" className="flex items-center gap-2">
              <Weight size={16} />{" "}
              <span className="overflow-hidden text-nowrap text-ellipsis">
                Totalvekt i gram
              </span>
            </Label>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                type="button"
                className="p-3 sm:p-4"
                onClick={() => {
                  onTotalYieldChange(Math.ceil(totalYield - 50));
                }}
              >
                <MinusIcon />
              </Button>
              <DeferredNumberInput
                id="totalYield"
                value={parseFloat(totalYield.toFixed(0))}
                onChange={onTotalYieldChange}
                min={0}
                className="w-20 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />
              <Button
                variant="outline"
                type="button"
                className="p-3 sm:p-4"
                onClick={() => {
                  onTotalYieldChange(Math.floor(totalYield + 50));
                }}
              >
                <PlusIcon />
              </Button>
            </div>
          </div>

          <div className="border-t pt-8">
            <div className="mb-4 flex items-center justify-between">
              <TypographyH4 as="h3">Ingredienser</TypographyH4>
              <Button
                variant="secondary"
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
          <Button type="button" variant="secondary" onClick={onReset}>
            Tilbakestill endringer
          </Button>
          <Button type="submit" onClick={handleSave}>
            Lagre og lukk
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
