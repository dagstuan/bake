"use client";

import { formatAmount } from "@/utils/recipeUtils";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "../ui/table";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { useRecipeContext } from "./recipeContext";
import {
  IngredientsCompletionState,
  RecipeIngredientState,
} from "./store/types";
import { useStore } from "zustand";
import { useShallow } from "zustand/react/shallow";

const isIngredientComplete = (
  ingredientsCompletion: IngredientsCompletionState,
  ingredientId: string,
) => {
  const ingredient = ingredientsCompletion[ingredientId];

  if (!ingredient) {
    return false;
  }

  return Object.values(ingredient).every((x) => x.completed);
};

interface IngredientsTableProps {
  group: string | null;
  ingredients: RecipeIngredientState[];
}

export const IngredientsTable = (props: IngredientsTableProps) => {
  const { group, ingredients } = props;

  const recipeStore = useRecipeContext();

  const [
    ingredientsCompletion,
    onIngredientCompletionChange,
    onAllIngredientsCompletionChange,
  ] = useStore(
    recipeStore,
    useShallow((s) => [
      s.ingredientsCompletion,
      s.onIngredientCompletionChange,
      s.onAllIngredientsCompletionChange,
    ]),
  );
  if (ingredients.length === 0) {
    return null;
  }

  const ingredientsCompletionMap = ingredients.map(({ id }) => {
    return isIngredientComplete(ingredientsCompletion, id);
  });

  const anyIngredientsComplete = ingredientsCompletionMap.some((x) => x);

  const allIngredientsComplete = ingredientsCompletionMap.every((x) => x);

  const anyWithAmount = ingredients.some(({ amount }) => !!amount);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="flex items-center">
            <Checkbox
              className="!transform-none"
              checked={
                anyIngredientsComplete && !allIngredientsComplete
                  ? "indeterminate"
                  : allIngredientsComplete
              }
              title="Merk alle ingredienser som fullført"
              onCheckedChange={(checked) => {
                if (checked === "indeterminate") {
                  onAllIngredientsCompletionChange(group, false);
                } else {
                  onAllIngredientsCompletionChange(group, checked);
                }
              }}
            />
          </TableHead>
          <TableHead>Ingrediens</TableHead>
          {anyWithAmount && (
            <TableHead className="text-right">Mengde</TableHead>
          )}
        </TableRow>
      </TableHeader>
      <TableBody>
        {ingredients.map(({ id, name, amount, unit, comment }) => {
          const isComplete = isIngredientComplete(ingredientsCompletion, id);

          const checkboxId = `ingredient-${id}-complete`;

          return (
            <TableRow key={id}>
              <TableCell>
                <div>
                  <Checkbox
                    id={checkboxId}
                    checked={isComplete}
                    title={`Marker ${name.toLowerCase()} som fullført`}
                    onCheckedChange={(checked) => {
                      if (checked === "indeterminate") return;

                      onIngredientCompletionChange(id, checked);
                    }}
                  />
                </div>
              </TableCell>
              <TableCell className="w-full">
                <Label htmlFor={checkboxId} className="hover:cursor-pointer">
                  {`${name}${comment ? ` (${comment})` : ""}`}
                </Label>
              </TableCell>
              {anyWithAmount && (
                <TableCell className="text-right">
                  {amount ? formatAmount(amount, unit) : ""}
                </TableCell>
              )}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};
