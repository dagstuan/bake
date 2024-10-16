import {
  aboutSitemapQuery,
  homeSitemapQuery,
  recipesSitemapQuery,
} from "@/sanity/lib/queries";
import { ArrayElement } from "@/utils/types";
import { MetadataRoute } from "next";
import { siteUrl } from "./shared-metadata";
import { loadQuery } from "@/sanity/loader/loadQuery";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [{ data: recipes }, { data: home }, { data: about }] =
    await Promise.all([
      loadQuery(recipesSitemapQuery),
      loadQuery(homeSitemapQuery),
      loadQuery(aboutSitemapQuery),
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
