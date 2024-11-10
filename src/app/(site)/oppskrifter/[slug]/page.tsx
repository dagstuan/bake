import { recipeQuery, allRecipesSlugQuery } from "@/sanity/lib/queries";
import { Metadata } from "next";
import { urlForImage } from "@/sanity/lib/utils";
import {
  openGraphMetadata,
  siteUrl,
  twitterMetadata,
} from "../../../shared-metadata";
import { sanityFetch } from "@/sanity/lib/live";
import { RecipePage } from "@/components/pages/RecipePage/RecipePage";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams(): Promise<
  Array<Awaited<Props["params"]>>
> {
  const { data: recipes } = await sanityFetch({
    query: allRecipesSlugQuery,
    perspective: "published",
    stega: false,
  });

  return recipes
    .map((r) => r?.slug)
    .filter((s) => s !== null)
    .map((slug) => ({
      slug,
    }));
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const { data: recipe } = await sanityFetch({
    query: recipeQuery,
    params,
    stega: false,
  });

  if (recipe) {
    const { title, mainImage, seo } = recipe;

    const imageWidth = 800;
    const imageHeight = 600;

    const imageUrl = mainImage
      ? (urlForImage(mainImage)
          ?.width(imageWidth)
          .height(imageHeight)
          .fit("max")
          .dpr(1)
          .url() ?? undefined)
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

export default async function Page(props: Props) {
  const params = await props.params;
  const initial = await sanityFetch({ query: recipeQuery, params });

  return <RecipePage data={initial.data} params={params} />;
}
