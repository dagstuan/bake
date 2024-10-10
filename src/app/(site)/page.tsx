import { RecipesGrid } from "@/components/RecipesGrid/RecipesGrid";
import { TypographyH1 } from "@/components/Typography/TypographyH1";
import { TypographyH2 } from "@/components/Typography/TypographyH2";
import { TypographyLink } from "@/components/Typography/TypographyLink";
import { sanityFetch } from "@/sanity/lib/client";
import { homePageQuery } from "@/sanity/lib/queries";
import { ArrowRightIcon } from "@radix-ui/react-icons";

export default async function Home() {
  const homePageData = await sanityFetch({
    query: homePageQuery,
  });

  const { subtitle, recipes } = homePageData ?? {};

  return (
    <main className="sm:mt-35 mt-8 flex flex-col gap-10 px-6 sm:mt-16 sm:items-center sm:gap-16">
      <div className="flex max-w-3xl flex-col gap-3 sm:text-center">
        <TypographyH1>
          Bak<span className="text-4xl font-extralight text-gray-400">&</span>
          del 🍞
        </TypographyH1>
        <p className="text-2xl">{subtitle}</p>
      </div>

      <div className="w-full max-w-6xl">
        <TypographyH2>Oppskrifter</TypographyH2>

        <div className="flex flex-col gap-4">
          <RecipesGrid recipes={recipes ?? []} />
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
  );
}
