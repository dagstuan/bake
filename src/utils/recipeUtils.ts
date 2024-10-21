import { Duration, TimeValue } from "../../sanity.types";

export const formatAmount = (
  amount: number | null | undefined,
  decimals: number = 1,
  defaultValue: string = "0",
): string =>
  amount ? `${parseFloat(amount.toFixed(decimals))}` : defaultValue;

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
    case "seconds":
      return `PT${time}S`;
    default:
      return "";
  }
};

export const formatDurationISO = (duration: Duration): string => {
  const { start, end } = duration;
  const timeValueToFormat = end || start;

  if (timeValueToFormat) {
    return formatTimeValueISO(timeValueToFormat);
  }

  return "";
};
