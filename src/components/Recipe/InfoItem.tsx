import { QuestionMarkCircledIcon } from "@radix-ui/react-icons";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { PopoverAnchor } from "@radix-ui/react-popover";

interface InfoItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  info: string;
}

export const InfoItem = ({ icon, label, value, info }: InfoItemProps) => (
  <Popover>
    <PopoverAnchor className="flex items-center justify-between gap-2 rounded-lg border bg-background px-3 py-1 text-sm text-foreground shadow">
      <div className="flex items-center space-x-2">
        {icon}
        <span className="font-medium">{label}:</span>
        <span>{value}</span>
      </div>

      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-muted-foreground"
          title="Mer informasjon"
        >
          <QuestionMarkCircledIcon className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
    </PopoverAnchor>
    <PopoverContent sideOffset={8} collisionPadding={8} className="w-80">
      <p className="text-sm">{info}</p>
    </PopoverContent>
  </Popover>
);
