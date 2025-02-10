import { cn } from "@/lib/utils";
import { HeartCrackIcon } from "../icons/HeartCrackIcon";
import { TypographyH2 } from "../Typography/TypographyH2";
import { TypographyP } from "../Typography/TypographyP";

interface NoRecipesProps {
  isTransitionPending: boolean;
}

export const NoRecipes = ({ isTransitionPending }: NoRecipesProps) => {
  return (
    <div
      className={cn("pt-8 text-center", {
        ["opacity-50"]: isTransitionPending,
      })}
    >
      <HeartCrackIcon className="text-foreground mx-auto h-12 w-12" />
      <TypographyH2 className="text-foreground">
        Ingen oppskrifter funnet!
      </TypographyH2>
      <TypographyP className="text-foreground/70 mt-2">
        Klarte ikke å finne noen oppskrifter som passer til det du søkte etter.
      </TypographyP>
    </div>
  );
};
