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
import { isIngredientComplete, RecipeIngredientState } from "./recipeReducer";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { useRecipeContext } from "./recipeContext";

type IngredientsTableProps = {
  group: string | null;
  ingredients: Array<RecipeIngredientState>;
};

export const IngredientsTable = (props: IngredientsTableProps) => {
  const { group, ingredients } = props;
  const { ingredientsCompletion, dispatch } = useRecipeContext();

  if (ingredients.length === 0) {
    return null;
  }

  const ingredientsCompletionMap = ingredients.map(({ id }) => {
    return isIngredientComplete(ingredientsCompletion, id);
  });

  const anyIngredientsComplete = ingredientsCompletionMap.some(
    (x) => x === true,
  );

  const allIngredientsComplete = ingredientsCompletionMap.every(
    (x) => x === true,
  );

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
                  dispatch({
                    type: "onAllIngredientsCompletionChange",
                    payload: {
                      group,
                      completed: false,
                    },
                  });
                } else {
                  dispatch({
                    type: "onAllIngredientsCompletionChange",
                    payload: {
                      group,
                      completed: checked,
                    },
                  });
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

                      dispatch({
                        type: "onIngredientCompletionChange",
                        payload: {
                          ingredientId: id,
                          completed: checked,
                        },
                      });
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
