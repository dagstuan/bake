// ./app/(blog)/posts/[slug]/page.tsx

import { QueryParams } from "next-sanity";
import { notFound } from "next/navigation";

import { client, sanityFetch } from "@/sanity/lib/client";
import { recipeQuery, allRecipesQuery } from "@/sanity/lib/queries";
import { Recipe } from "@/components/Recipe/Recipe";
import { Metadata } from "next";
import { urlForImage } from "@/sanity/lib/utils";

export async function generateStaticParams() {
  const recipes = await client.fetch(
    allRecipesQuery,
    {},
    { perspective: "published" },
  );

  return recipes.map((recipe) => ({
    slug: recipe?.slug,
  }));
}

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const recipe = await sanityFetch({
    query: recipeQuery,
    params,
  });

  if (recipe) {
    const { title, mainImage } = recipe;

    return {
      title,
      openGraph: {
        images: mainImage?.asset?._id
          ? [
              {
                url:
                  urlForImage(mainImage.asset._id)
                    ?.width(800)
                    .height(600)
                    .dpr(1)
                    .url() ?? "",
                width: 800,
                height: 600,
              },
            ]
          : [],
      },
    };
  }

  return {};
}

export default async function Page({ params }: { params: QueryParams }) {
  const recipe = await sanityFetch({
    query: recipeQuery,
    params,
  });

  if (!recipe) {
    return notFound();
  }
  return <Recipe recipe={recipe} />;
}
