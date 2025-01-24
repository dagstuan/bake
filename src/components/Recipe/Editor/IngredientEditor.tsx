import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TableCell, TableRow } from "@/components/ui/table";
import { formatAmount } from "@/utils/recipeUtils";
import * as v from "valibot";
import { useStore } from "zustand";
import { DeferredNumberInput } from "../DeferredNumberInput";
import { useRecipeContext } from "../recipeContext";
import { ingredientUnit, RecipeIngredientState } from "../store/types";
import { editableUnits, formatUnit, isEditableUnit } from "../utils";

interface IngredientEditorProps {
  ingredient: RecipeIngredientState;
}

export const IngredientEditor = (props: IngredientEditorProps) => {
  const {
    ingredient: { id, name, amount, unit, weights, conversions },
  } = props;

  const recipeStore = useRecipeContext();
  const onIngredientAmountChange = useStore(
    recipeStore,
    (s) => s.onIngredientAmountChange,
  );
  const onIngredientUnitChange = useStore(
    recipeStore,
    (s) => s.onIngredientUnitChange,
  );
  const onConvertIngredient = useStore(
    recipeStore,
    (s) => s.onConvertIngredient,
  );

  const handleIngredientUnitChange = (
    ingredientId: string,
    newUnit: string,
  ) => {
    const parsedUnit = v.parse(ingredientUnit, newUnit);

    onIngredientUnitChange(ingredientId, parsedUnit);
  };

  const unitOptions = editableUnits.filter((unit) => {
    switch (unit) {
      case "g":
      case "kg":
        return !!weights.l || !!weights.ss || !!weights.ts;
      case "dl":
      case "l":
        return !!weights.l;
      case "ts":
        return !!weights.ts;
      case "ss":
        return !!weights.ss;
      default:
        return false;
    }
  });

  return (
    <TableRow>
      <TableCell>
        {conversions.length === 0 ? (
          <Label htmlFor={`ingredient-${id}`} className="text-left">
            {name}
          </Label>
        ) : (
          <Select
            value={name}
            onValueChange={(newValue) => {
              onConvertIngredient(id, newValue);
            }}
          >
            <SelectTrigger className="text-md">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {conversions
                .map((c) => c.to)
                .concat(name)
                .sort()
                .map((name) => (
                  <SelectItem key={name} value={name}>
                    {name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        )}
      </TableCell>
      <TableCell>
        <DeferredNumberInput
          id={`ingredient-${id}`}
          className="w-full [appearance:textfield] text-right [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          value={parseFloat(formatAmount(amount, unit))}
          min={0.00001}
          max={100000}
          onChange={(newValue) => {
            if (newValue > 0) {
              onIngredientAmountChange(
                id,
                parseFloat(formatAmount(newValue, unit)),
              );
            }
          }}
        />
      </TableCell>

      <TableCell>
        {isEditableUnit(unit) && unitOptions.length > 0 ? (
          <Select
            value={unit}
            onValueChange={(v) => {
              handleIngredientUnitChange(id, v);
            }}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {unitOptions.map((unit) => (
                <SelectItem key={unit} value={unit}>
                  {formatUnit(unit)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          unit && (
            <div
              className="h-9 w-max cursor-not-allowed rounded-md px-3 py-2 text-sm"
              title="Denne enheten kan ikke endres."
            >
              {formatUnit(unit)}
            </div>
          )
        )}
      </TableCell>
    </TableRow>
  );
};
