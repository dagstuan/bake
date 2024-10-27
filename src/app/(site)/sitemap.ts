import {
  aboutSitemapQuery,
  homeSitemapQuery,
  recipesSitemapQuery,
} from "@/sanity/lib/queries";
import { ArrayElement } from "@/utils/types";
import { MetadataRoute } from "next";
import { siteUrl } from "./shared-metadata";
import { sanityFetchNonLive } from "@/sanity/lib/client";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [recipes, home, about] = await Promise.all([
    sanityFetchNonLive({ query: recipesSitemapQuery, revalidate: 60 * 60 }),
    sanityFetchNonLive({ query: homeSitemapQuery, revalidate: 60 * 60 }),
    sanityFetchNonLive({ query: aboutSitemapQuery, revalidate: 60 * 60 }),
  ]);

  const mappedRecipes = recipes
    .map<ArrayElement<MetadataRoute.Sitemap> | null>((recipe) => {
      if (!recipe.slug) {
        return null;
      }

      return {
        url: `${siteUrl}/oppskrifter/${recipe.slug}`,
        lastModified: recipe._updatedAt ?? new Date(),
        changeFrequency: "weekly",
        priority: 0.9,
      };
    })
    .filter((recipe) => recipe !== null);

  return [
    {
      url: siteUrl,
      lastModified: home?._updatedAt ?? new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${siteUrl}/om`,
      lastModified: about?._updatedAt ?? new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/oppskrifter`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...mappedRecipes,
  ];
}
