import { QuestionMarkCircledIcon } from "@radix-ui/react-icons";
import { PopoverAnchor } from "@radix-ui/react-popover";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

interface InfoItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  info: string;
}

export const InfoItem = ({ icon, label, value, info }: InfoItemProps) => (
  <Popover>
    <PopoverAnchor className="bg-background text-foreground flex items-center justify-between gap-2 rounded-lg border px-3 py-1 text-sm">
      <div className="flex items-center space-x-2">
        {icon}
        <span className="font-medium">{label}:</span>
        <span>{value}</span>
      </div>

      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground h-6 w-6"
          title="Mer informasjon"
        >
          <QuestionMarkCircledIcon className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
    </PopoverAnchor>
    <PopoverContent
      sideOffset={8}
      collisionPadding={8}
      side="bottom"
      align="start"
      className="max-w-(--radix-popover-content-available-width) min-w-(--radix-popover-trigger-width)"
    >
      <p className="text-sm">{info}</p>
    </PopoverContent>
  </Popover>
);
