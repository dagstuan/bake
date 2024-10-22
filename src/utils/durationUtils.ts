import { nb } from "date-fns/locale";
import { formatDuration } from "date-fns/formatDuration";
import { TimeValue, Duration as DurationType } from "../../sanity.types";

export const formatTimeValue = (value: TimeValue): string => {
  if (!value) {
    return "";
  }

  const { time, type } = value;

  return formatDuration(
    {
      days: type === "days" ? time : undefined,
      hours: type === "hours" ? time : undefined,
      minutes: type === "minutes" ? time : undefined,
    },
    { locale: nb },
  );
};

const formatTimeValueShort = (value: TimeValue): string | null => {
  if (!value?.time || value.time === 0 || !value.type) {
    return null;
  }

  const { time, type } = value;

  switch (type) {
    case "days":
      if (time === 1) return "En dag";
      if (time === 2) return "To dager";
      return "Over to dager";
    case "hours":
      if (time === 1) return "En time";
      if (time === 2) return "To timer";
      if (time === 3) return "Tre timer";
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
