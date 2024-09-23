// ./app/(blog)/posts/[slug]/page.tsx

import { QueryParams } from "next-sanity";
import { notFound } from "next/navigation";

import { client, sanityFetch } from "@/sanity/lib/client";
import { recipeQuery, recipesQuery } from "@/sanity/lib/queries";
import { Recipe } from "@/components/Recipe";

export async function generateStaticParams() {
  const recipes = await client.fetch(
    recipesQuery,
    {},
    { perspective: "published" },
  );

  return recipes.map((post) => ({
    slug: post?.slug?.current,
  }));
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
