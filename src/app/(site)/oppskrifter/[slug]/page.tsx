import { recipeQuery, allRecipesSlugQuery } from "@/sanity/lib/queries";
import { Metadata } from "next";
import { urlForImage } from "@/sanity/lib/utils";
import {
  openGraphMetadata,
  siteUrl,
  twitterMetadata,
} from "../../shared-metadata";
import { loadQuery } from "@/sanity/loader/loadQuery";
import { getClient } from "@/sanity/lib/client";
import { RecipePage } from "@/components/pages/RecipePage/RecipePage";
import { draftMode } from "next/headers";
import { RecipePagePreview } from "@/components/pages/RecipePage/RecipePagePreview";

type Props = {
  params: { slug: string };
};

export async function generateStaticParams(): Promise<Array<Props["params"]>> {
  const recipes = await getClient()
    .withConfig({
      perspective: "published",
    })
    .fetch(allRecipesSlugQuery);

  return recipes
    .map((r) => r?.slug)
    .filter((s) => s !== null)
    .map((slug) => ({
      slug,
    }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { data: recipe } = await loadQuery(recipeQuery, params);

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

export default async function Page({ params }: Props) {
  const initial = await loadQuery(recipeQuery, params);

  if (draftMode().isEnabled) {
    return <RecipePagePreview initial={initial} params={params} />;
  }

  return <RecipePage data={initial.data} params={params} />;
}
