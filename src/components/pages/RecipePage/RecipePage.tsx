import { notFound } from "next/navigation";

import { Recipe } from "@/components/Recipe/Recipe";
import { urlForImage } from "@/sanity/lib/utils";
import type { Recipe as RecipeSchema, WithContext } from "schema-dts";
import { JsonLd } from "@/components/JsonLd/JsonLd";
import { formatDurationISO } from "@/utils/recipeUtils";
import { RecipeQueryResult } from "../../../../sanity.types";
import { creator, siteUrl } from "@/app/(site)/shared-metadata";

type RecipePageProps = {
  params: { slug: string };
  data: RecipeQueryResult | null;
};

export const RecipePage = (props: RecipePageProps) => {
  const { params, data: recipe } = props;

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
      ? (urlForImage(recipe.mainImage)
          ?.width(800)
          .height(600)
          .fit("crop")
          .dpr(1)
          .url() ?? "")
      : "",
  };

  return (
    <>
      <Recipe recipe={recipe} />
      <JsonLd jsonLd={jsonLd} />
    </>
  );
};
