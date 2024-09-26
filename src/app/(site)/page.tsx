import { TypographyH1 } from "@/components/Typography/TypographyH1";
import { TypographyH2 } from "@/components/Typography/TypographyH2";
import { sanityFetch } from "@/sanity/lib/client";
import { frontPageRecipesQuery } from "@/sanity/lib/queries";
import { urlForImage } from "@/sanity/lib/utils";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  const recipes = await sanityFetch({
    query: frontPageRecipesQuery,
  });

  return (
    <main className="sm:mt-35 mt-16 flex flex-col items-center gap-20 pl-5 pr-5">
      <div className="mx-auto flex max-w-3xl flex-col gap-3 sm:text-center">
        <TypographyH1>Bake 🍞</TypographyH1>
        <p className="text-2xl">Lettleste oppskrifter som skalerer.</p>
      </div>

      <div className="w-full max-w-6xl">
        <TypographyH2>Oppskrifter</TypographyH2>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {recipes.map((recipe) => (
            <Link
              href={`/oppskrifter/${recipe.slug?.current}`}
              key={recipe._id}
              className="flex flex-col justify-between rounded-lg bg-white shadow-sm"
            >
              {recipe.mainImage ? (
                <Image
                  width={1000}
                  height={1000}
                  src={
                    urlForImage(recipe.mainImage)
                      ?.height(1000)
                      .width(1000)
                      .url() ?? ""
                  }
                  alt={recipe.mainImage?.alt ?? "Recipe"}
                  className="h-48 w-full rounded-t-lg object-cover"
                />
              ) : (
                <div className="flex w-full flex-grow items-center justify-center text-8xl">
                  🍞
                </div>
              )}
              <div className="p-4">
                <h2 className="text-2xl font-bold">{recipe.title}</h2>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
