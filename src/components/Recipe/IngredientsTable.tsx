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

  const ingredientsCompletionMap = ingredients.map(({ ingredientId }) => {
    return isIngredientComplete(ingredientsCompletion, ingredientId);
  });

  const anyIngredientsComplete = ingredientsCompletionMap.some(
    (x) => x === true,
  );

  const allIngredientsComplete = ingredientsCompletionMap.every(
    (x) => x === true,
  );

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
          <TableHead className="text-right">Mengde</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {ingredients.map(({ ingredientId, name, amount, unit }) => {
          const isComplete = isIngredientComplete(
            ingredientsCompletion,
            ingredientId,
          );

          const checkboxId = `ingredient-${ingredientId}-complete`;

          return (
            <TableRow key={ingredientId}>
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
                          ingredientId,
                          completed: checked,
                        },
                      });
                    }}
                  />
                </div>
              </TableCell>
              <TableCell className="w-full">
                <Label htmlFor={checkboxId} className="hover:cursor-pointer">
                  {name}
                </Label>
              </TableCell>
              <TableCell className="text-right">
                {formatAmount(amount)} {unit}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};
