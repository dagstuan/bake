import { Label } from "@/components/ui/label";
import { ingredientUnit, RecipeIngredientState } from "../recipeReducer";
import { DeferredNumberInput } from "../DeferredNumberInput";
import { formatAmount } from "@/utils/recipeUtils";
import { useRecipeContext } from "../recipeContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IngredientUnit } from "../types";

import * as v from "valibot";

const editableUnits: Array<IngredientUnit> = ["g", "kg", "l", "dl", "ss", "ts"];

const isEditableUnit = (
  unit: RecipeIngredientState["unit"],
): unit is IngredientUnit => !!unit && editableUnits.includes(unit);

type IngredientEditorProps = {
  ingredient: RecipeIngredientState;
};

export const IngredientEditor = (props: IngredientEditorProps) => {
  const {
    ingredient: { id, name, amount, unit, weights },
  } = props;

  const { dispatch } = useRecipeContext();

  const handleIngredientChange = (ingredientId: string, newAmount: number) => {
    dispatch({
      type: "onIngredientChange",
      payload: {
        ingredientId,
        newAmount,
      },
    });
  };

  const handleIngredientUnitChange = (
    ingredientId: string,
    newUnit: string,
  ) => {
    const parsedUnit = v.parse(ingredientUnit, newUnit);

    dispatch({
      type: "onIngredientUnitChange",
      payload: {
        ingredientId,
        newUnit: parsedUnit,
      },
    });
  };

  const unitOptions = editableUnits.filter((unit) => {
    if (weights === undefined) {
      return true;
    }

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
    <>
      <Label htmlFor={`ingredient-${id}`} className="text-right">
        {name}
      </Label>
      <div className="flex items-center gap-2">
        <DeferredNumberInput
          id={`ingredient-${id}`}
          className="w-24"
          value={parseFloat(formatAmount(amount, unit))}
          min={0.00001}
          max={100000}
          onChange={(newValue) => handleIngredientChange(id, newValue)}
        />
        {isEditableUnit(unit) && unitOptions.length > 0 ? (
          <Select
            value={unit}
            onValueChange={(v) => handleIngredientUnitChange(id, v)}
          >
            <SelectTrigger className="w-[65px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {unitOptions.map((unit) => (
                <SelectItem key={unit} value={unit}>
                  {unit}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          unit
        )}
      </div>
    </>
  );
};
