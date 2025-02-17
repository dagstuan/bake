import formatDuration from "date-fns/formatDuration";
import { nb } from "date-fns/locale";
import { Duration as DurationType, TimeValue } from "../../sanity.types";

const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const formatTimeValue = (
  value: TimeValue | null | undefined,
): string => {
  if (!value) {
    return "";
  }

  const { time, type } = value;

  return capitalize(
    formatDuration(
      {
        days: type === "days" ? time : undefined,
        hours: type === "hours" ? time : undefined,
        minutes: type === "minutes" ? time : undefined,
      },
      { locale: nb },
    ),
  );
};

const formatTimeValueShort = (value: TimeValue): string | null => {
  if (!value.time || value.time === 0 || !value.type) {
    return null;
  }

  const { time, type } = value;

  switch (type) {
    case "days":
      if (time === 1) return "En dag";
      if (time === 2) return "To dager";
      return "Over to dager";
    case "hours":
      if (time <= 1) return "En time";
      if (time <= 2) return "To timer";
      if (time <= 3) return "Tre timer";
      return "Over tre timer";
    case "minutes":
      return `${time} min`;
    default:
      return null;
  }
};

export const formatDurationShort = (
  value: DurationType | null,
): string | null => {
  if (!value) {
    return null;
  }

  const { start, end } = value;

  if (start) {
    return formatTimeValueShort(start);
  } else if (end) {
    return formatTimeValueShort(end);
  }

  return null;
};

export function formatDurationLong(
  duration: DurationType | null,
): string | null {
  if (!duration) {
    return null;
  }

  const { start, end } = duration;

  // If only one of start or end is present, return its formatted value
  if (!(start?.time && start.type) && end?.time && end.type)
    return formatTimeValue(end);
  if (start?.time && start.type && !(end?.time && end.type))
    return formatTimeValue(start);
  if (!start || !end || !start.time || !end.time || !start.type || !end.type)
    return null;

  // If both values have the same unit, format as "x-y [unit]"
  if (start.type === end.type) {
    return `${start.time}-${end.time} ${getNorwegianUnit(end.time, end.type)}`;
  }

  // Otherwise, format as "x [unit] til y [unit]"
  const formattedStart = `${formatNumber(start.time, start.type)} ${getNorwegianUnit(start.time, start.type)}`;
  const formattedEnd = `${formatNumber(end.time, end.type)} ${getNorwegianUnit(end.time, end.type)}`;

  return `${formattedStart} til ${formattedEnd}`;
}

function getNorwegianUnit(
  value: number,
  unit: "hours" | "minutes" | "days",
): string {
  const translations: Record<string, { singular: string; plural: string }> = {
    hours: { singular: "time", plural: "timer" },
    minutes: { singular: "minutt", plural: "minutter" },
    days: { singular: "dag", plural: "dager" },
  };

  return value === 1 ? translations[unit].singular : translations[unit].plural;
}

function formatNumber(
  value: number,
  unit: NonNullable<TimeValue["type"]>,
): string {
  if (value === 1 && getNorwegianUnit(value, unit) === "minutt") return "Ett";
  if (value === 1) return "En";
  return `${value}`;
}
