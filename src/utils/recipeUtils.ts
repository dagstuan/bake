import { Duration, RecipeIngredient, TimeValue } from "../../sanity.types";

type FormatAmountUnit = RecipeIngredient["unit"] | "%" | null | undefined;

const getDecimalsForValueAndUnit = (
  value: number,
  unit: FormatAmountUnit,
): number => {
  switch (unit) {
    case "kg":
      return value < 1 ? 2 : 1;
    case "g":
      return value < 100 ? 1 : 0;
    case "l":
      return value < 1 ? 2 : 1;
    case "dl":
      return value < 1 ? 2 : 1;
    case "fedd":
    case "neve":
      return 1;
    case "ss":
      return value < 1 ? 2 : value > 10 ? 0 : 1;
    case "stk":
      return 1;
    case "ts":
      return value < 1 ? 2 : value > 10 ? 0 : 1;
    case "%":
      return 0;
    default:
      return 1;
  }
};

export const formatAmount = (
  amount: number | null | undefined,
  unit: FormatAmountUnit,
  defaultValue = "",
): string => {
  const amountString = amount
    ? `${parseFloat(amount.toFixed(getDecimalsForValueAndUnit(amount, unit)))}`
    : defaultValue;

  return unit
    ? `${amountString}${unit === "%" ? "%" : ` ${unit}`}`
    : amountString;
};

const formatTimeValueISO = (timeValue: TimeValue): string => {
  const { time, type } = timeValue;

  if (!time || !type) {
    return "";
  }

  switch (type) {
    case "days":
      return `P${time}D`;
    case "hours":
      return `PT${time}H`;
    case "minutes":
      return `PT${time}M`;
    default:
      return "";
  }
};

export const formatDurationISO = (duration: Duration): string => {
  const { start, end } = duration;
  const timeValueToFormat = end ?? start;

  if (timeValueToFormat) {
    return formatTimeValueISO(timeValueToFormat);
  }

  return "";
};
