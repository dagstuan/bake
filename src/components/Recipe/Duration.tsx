import { ReactNode } from "react";
import { Duration as DurationType } from "../../../sanity.types";
import { Badge } from "../ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { capitalize } from "@/utils/tsUtils";
import { formatTimeValue } from "@/utils/durationUtils";

type DurationProps = {
  icon: ReactNode;
  title: string;
  duration: DurationType;
  tooltip: string;
};

const formatDurationType = (duration: DurationType): string => {
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

export const Duration = (props: DurationProps) => {
  const { icon, duration, tooltip, title } = props;

  if (!duration || (!duration.start && !duration.end)) {
    return null;
  }

  return (
    <Tooltip>
      <TooltipTrigger>
        <Badge variant="outline" className="flex items-center gap-2">
          {icon}
          {title} {formatDurationType(duration)}
        </Badge>
      </TooltipTrigger>
      <TooltipContent side="bottom">{tooltip}</TooltipContent>
    </Tooltip>
  );
};
