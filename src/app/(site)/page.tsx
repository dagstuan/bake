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
    <main className="mt-16 sm:mt-35 pl-5 pr-5 flex flex-col gap-20 items-center">
      <div className="mx-auto max-w-3xl sm:text-center flex flex-col gap-3">
        <h1 className="text-7xl font-bold">Bake 🍞</h1>
        <p className="text-2xl">Lettleste oppskrifter som skalerer.</p>
      </div>

      <div className="max-w-6xl w-full">
        <h2 className="text-4xl font-bold mt-8">Oppskrifter</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-8">
          {recipes.map((recipe) => (
            <Link
              href={`/oppskrifter/${recipe.slug?.current}`}
              key={recipe._id}
              className="bg-white rounded-lg shadow-sm flex flex-col justify-between"
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
                  className="rounded-t-lg w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full flex justify-center items-center flex-grow text-8xl">
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
