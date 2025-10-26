import { RecipeQueryResult } from "../../../../sanity.types";
import { TypographyH1 } from "../../Typography/TypographyH1";
import { MainImage } from "./MainImage";

type RQR = NonNullable<RecipeQueryResult>;

export interface RecipeHeaderProps {
  title: RQR["title"];
  mainImage: RQR["mainImage"];
  slug: string;
}

export const RecipeHeader = ({ title, mainImage, slug }: RecipeHeaderProps) => {
  return (
    <>
      <TypographyH1 className="text-center sm:mb-8">{title}</TypographyH1>
      <MainImage mainImage={mainImage} slug={slug} />
    </>
  );
};
