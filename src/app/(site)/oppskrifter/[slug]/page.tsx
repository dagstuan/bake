import { QueryParams } from "next-sanity";
import { notFound } from "next/navigation";

import { client, sanityFetch } from "@/sanity/lib/client";
import { recipeQuery, allRecipesQuery } from "@/sanity/lib/queries";
import { Recipe } from "@/components/Recipe/Recipe";
import { Metadata } from "next";
import { urlForImage } from "@/sanity/lib/utils";
import type { Recipe as RecipeSchema, WithContext } from "schema-dts";
import { JsonLd } from "@/components/JsonLd/JsonLd";
import {
  creator,
  openGraphMetadata,
  siteUrl,
  twitterMetadata,
} from "../../shared-metadata";
import { formatDurationISO } from "@/utils/recipeUtils";

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
    const { title, mainImage, seo } = recipe;

    const imageWidth = 800;
    const imageHeight = 600;

    const imageUrl = mainImage
      ? (urlForImage(mainImage)?.width(imageWidth).height(600).dpr(1).url() ??
        undefined)
      : undefined;

    return {
      title: seo?.metaTitle ?? title ?? "",
      description: seo?.metaDescription ?? "",
      openGraph: {
        ...openGraphMetadata,
        title: seo?.metaTitle ?? title ?? "",
        url: `${siteUrl}/oppskrifter/${params.slug}`,
        images: imageUrl
          ? [
              {
                url: imageUrl,
                width: imageWidth,
                height: imageHeight,
              },
            ]
          : [],
      },
      twitter: {
        ...twitterMetadata,
        title: seo?.metaTitle ?? title ?? twitterMetadata?.title,
        description: seo?.metaDescription ?? "",
        images: imageUrl
          ? [
              {
                url: imageUrl,
                width: imageWidth,
                height: imageHeight,
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

  const jsonLd: WithContext<RecipeSchema> = {
    "@context": "https://schema.org",
    "@type": "Recipe",
    name: recipe.seo?.metaTitle ?? recipe.title ?? "",
    description: recipe.seo?.metaDescription ?? "",
    url: `${siteUrl}/oppskrifter/${params.slug}`,
    datePublished: recipe._createdAt,
    author: {
      "@type": "Person",
      name: creator,
    },
    creator: {
      "@type": "Person",
      name: creator,
    },
    prepTime: recipe.activeTime
      ? formatDurationISO(recipe.activeTime)
      : undefined,
    cookTime: recipe.totalTime
      ? formatDurationISO(recipe.totalTime)
      : undefined,
    recipeCategory:
      recipe.categories?.map((category) => category.title).join(", ") ?? "",
    image: recipe.mainImage
      ? (urlForImage(recipe.mainImage)?.width(800).height(600).dpr(1).url() ??
        "")
      : "",
  };

  return (
    <>
      <Recipe recipe={recipe} />
      <JsonLd jsonLd={jsonLd} />
    </>
  );
}
