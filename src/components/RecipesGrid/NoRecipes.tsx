import { HeartCrackIcon } from "../icons/HeartCrackIcon";
import { TypographyH2 } from "../Typography/TypographyH2";
import { TypographyP } from "../Typography/TypographyP";

export const NoRecipes = () => {
  return (
    <div className="pt-8 text-center">
      <HeartCrackIcon className="mx-auto h-12 w-12 text-gray-400" />
      <TypographyH2 className="text-gray-900">
        Ingen oppskrifter funnet!
      </TypographyH2>
      <TypographyP className="mt-2 text-gray-500">
        Klarte ikke å finne noen oppskrifter som passer til det du søkte etter.
      </TypographyP>
    </div>
  );
};
