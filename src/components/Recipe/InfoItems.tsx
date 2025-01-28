import { formatAmount } from "@/utils/recipeUtils";
import { ClockIcon } from "@radix-ui/react-icons";
import { Weight } from "lucide-react";
import { useStore } from "zustand";
import { useShallow } from "zustand/react/shallow";
import { Duration } from "../../../sanity.types";
import { CakeSliceIcon } from "../icons/CakeSliceIcon";
import { CookingPotIcon } from "../icons/CookingPotIcon";
import { InfoItem } from "./InfoItem";
import { useRecipeContext } from "./recipeContext";
import { formatDurationType } from "./utils";

interface InfoItemsProps {
  activeTime: Duration | null;
  totalTime: Duration | null;
}

export const InfoItems = ({ activeTime, totalTime }: InfoItemsProps) => {
  const recipeStore = useRecipeContext();

  const [servings, totalYield, yieldPerServing] = useStore(
    recipeStore,
    useShallow((s) => [s.servings, s.totalYield, s.yieldPerServing]),
  );

  return (
    <div className="flex flex-col flex-wrap gap-2">
      <InfoItem
        icon={<CakeSliceIcon />}
        label="Antall"
        value={formatAmount(servings, undefined)}
        info="Antall porsjoner du får."
      />

      {activeTime && (
        <InfoItem
          icon={<CookingPotIcon />}
          label="Aktiv tid"
          value={formatDurationType(activeTime)}
          info="Aktiv tidsbruk som kreves for å lage oppskriften."
        />
      )}

      {totalTime && (
        <InfoItem
          icon={<ClockIcon />}
          label="Total tid"
          value={formatDurationType(totalTime)}
          info="Total tidsbruk fra du starter til retten er ferdig."
        />
      )}

      {totalYield && yieldPerServing && (
        <InfoItem
          icon={<Weight size="1rem" />}
          label="Vekt"
          value={`${formatAmount(totalYield, "g")} / ${formatAmount(yieldPerServing, "g")}`}
          info="Total vekt av alle ingredienser, og vekt per porsjon som lages."
        />
      )}
    </div>
  );
};
