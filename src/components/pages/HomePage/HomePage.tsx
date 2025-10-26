import { TypographyH1 } from "@/components/Typography/TypographyH1";
import { TypographyH2 } from "@/components/Typography/TypographyH2";
import { TypographyLink } from "@/components/Typography/TypographyLink";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { HomePageQueryResult } from "../../../../sanity.types";
import { HomePageRecipes } from "./HomePageRecipes";
import { ViewTransition } from "react";

interface HomePageProps {
  data: HomePageQueryResult;
}

export const HomePage = (props: HomePageProps) => {
  const { _id, _type, subtitle, recipes } = props.data ?? {};

  return (
    <ViewTransition>
      <main className="mt-8 flex flex-col gap-10 px-6 sm:mt-16 sm:items-center sm:gap-16">
        <div className="flex max-w-3xl flex-col gap-3 sm:text-center">
          <TypographyH1>
            Bak<span className="text-4xl font-extralight text-gray-400">&</span>
            del 🧑‍🍳
          </TypographyH1>
          <p className="text-2xl">{subtitle}</p>
        </div>

        <div className="w-full max-w-6xl">
          <TypographyH2>Oppskrifter</TypographyH2>

          <div className="flex flex-col gap-4">
            <HomePageRecipes
              documentId={_id}
              documentType={_type}
              recipes={recipes}
            />

            <TypographyLink
              href="/oppskrifter"
              type="internal"
              className="flex items-center gap-1 self-end"
            >
              Se alle oppskrifter <ArrowRightIcon />
            </TypographyLink>
          </div>
        </div>
      </main>
    </ViewTransition>
  );
};
