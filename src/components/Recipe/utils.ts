import { Duration as DurationType } from "../../../sanity.types";
import { formatTimeValue } from "@/utils/durationUtils";
import { capitalize } from "@/utils/tsUtils";

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
