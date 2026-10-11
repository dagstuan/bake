import { recipeQuery, allRecipesSlugQuery } from "@/sanity/lib/queries";
import { Metadata } from "next";
import { urlForImage } from "@/sanity/lib/utils";
import {
  openGraphMetadata,
  siteUrl,
  twitterMetadata,
} from "../../../shared-metadata";
import {
  getDynamicFetchOptions,
  sanityFetch,
  sanityFetchMetadata,
  sanityFetchStaticParams,
  type DynamicFetchOptions,
} from "@/sanity/lib/live";
import { RecipePage } from "@/components/pages/RecipePage/RecipePage";
import { RecipePageSkeleton } from "@/components/pages/RecipePage/RecipePageSkeleton";
import { Suspense } from "react";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams(): Promise<
  Awaited<Props["params"]>[]
> {
  const { data: recipes } = await sanityFetchStaticParams({
    query: allRecipesSlugQuery,
  });

  return recipes
    .map((r) => r.slug)
    .filter((s) => s !== null)
    .map((slug) => ({
      slug,
    }));
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const [params, { perspective }] = await Promise.all([
    props.params,
    getDynamicFetchOptions(),
  ]);
  const { data: recipe } = await sanityFetchMetadata({
    query: recipeQuery,
    params,
    perspective,
  });

  if (recipe) {
    const { title, mainImage, seo, searchTerms } = recipe;

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
      keywords: searchTerms ?? undefined,
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
  const { perspective, stega } = await getDynamicFetchOptions();

  return (
    <Suspense fallback={<RecipePageSkeleton />}>
      <RecipePageContent
        params={props.params}
        perspective={perspective}
        stega={stega}
      />
    </Suspense>
  );
}

async function RecipePageContent(
  props: { params: Props["params"] } & DynamicFetchOptions,
) {
  "use cache";

  const { perspective, stega } = props;

  const { slug } = await props.params;

  const initial = await sanityFetch({
    query: recipeQuery,
    params: { slug },
    perspective,
    stega,
  });

  return <RecipePage data={initial.data} slug={slug} />;
}
