import { Duration as DurationType } from "../../../sanity.types";
import { formatTimeValue } from "@/utils/durationUtils";
import { capitalize } from "@/utils/tsUtils";
import { IngredientUnit } from "./types";
import { RecipeIngredientState } from "./recipeReducer";

export const formatDurationType = (duration: DurationType): string => {
  const { start, end } = duration;

  if (start?.time && end?.time) {
    if (start.type === end.type) {
      return `${start.time}-${formatTimeValue(end)}`;
    }

    return `${capitalize(formatTimeValue(start))} - ${formatTimeValue(end)}`;
  } else if (start) {
    return capitalize(formatTimeValue(start));
  } else if (end) {
    return capitalize(formatTimeValue(end));
  }

  return "";
};

export const formatUnit = (unit: IngredientUnit): string => {
  switch (unit) {
    case "g":
      return "gram";
    case "kg":
      return "kilogram";
    case "l":
      return "liter";
    case "dl":
      return "desiliter";
    case "ss":
      return "spiseskje";
    case "ts":
      return "teskje";
    default:
      return unit;
  }
};

export const editableUnits: Array<IngredientUnit> = [
  "g",
  "kg",
  "l",
  "dl",
  "ss",
  "ts",
];

export const isEditableUnit = (
  unit: RecipeIngredientState["unit"],
): unit is IngredientUnit => !!unit && editableUnits.includes(unit);
