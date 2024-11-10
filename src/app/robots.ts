import { MetadataRoute } from "next";
import { siteUrl } from "./shared-metadata";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/"],
      disallow: ["/oppskrifter?query="],
    },
    sitemap: [`${siteUrl}/sitemap.xml`],
  };
}
