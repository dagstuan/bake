import { formatDuration } from "date-fns";
import { nb } from "date-fns/locale";
import { ReactNode } from "react";
import { Duration as DurationType, TimeValue } from "../../../sanity.types";
import { Badge } from "../ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { capitalize } from "@/utils/tsUtils";

type DurationProps = {
  icon: ReactNode;
  duration: DurationType;
  tooltip: string;
};

const formatTimeValue = (value: TimeValue): string => {
  if (!value) {
    return "";
  }

  const { time, type } = value;

  return formatDuration(
    {
      days: type === "days" ? time : undefined,
      hours: type === "hours" ? time : undefined,
      minutes: type === "minutes" ? time : undefined,
      seconds: type === "seconds" ? time : undefined,
    },
    { locale: nb },
  );
};

const formatDurationType = (duration: DurationType): string => {
  const { start, end } = duration;

  if (start && end) {
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

export const Duration = (props: DurationProps) => {
  const { icon, duration, tooltip } = props;

  if (!duration || (!duration.start && !duration.end)) {
    return null;
  }

  return (
    <Tooltip>
      <TooltipTrigger>
        <Badge variant="outline" className="flex items-center gap-2">
          {icon}
          {formatDurationType(duration)}
        </Badge>
      </TooltipTrigger>
      <TooltipContent side="bottom">{tooltip}</TooltipContent>
    </Tooltip>
  );
};
