import { sanityFetch } from "@/sanity/lib/client";
import {
  aboutSitemapQuery,
  homeSitemapQuery,
  recipesSitemapQuery,
} from "@/sanity/lib/queries";
import { ArrayElement } from "@/utils/types";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [recipes, home, about] = await Promise.all([
    sanityFetch({
      query: recipesSitemapQuery,
    }),
    sanityFetch({
      query: homeSitemapQuery,
    }),
    sanityFetch({
      query: aboutSitemapQuery,
    }),
  ]);

  const mappedRecipes = recipes
    .map<ArrayElement<MetadataRoute.Sitemap> | null>((recipe) => {
      if (!recipe.slug) {
        return null;
      }

      return {
        url: `https://bakdel.no/oppskrifter/${recipe.slug}`,
        lastModified: recipe._updatedAt ?? new Date(),
        changeFrequency: "weekly",
        priority: 0.9,
      };
    })
    .filter((recipe) => recipe !== null);

  return [
    {
      url: "https://bakdel.no",
      lastModified: home?._updatedAt ?? new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: "https://bakdel.no/om",
      lastModified: about?._updatedAt ?? new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: "https://bakdel.no/oppskrifter",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...mappedRecipes,
  ];
}
