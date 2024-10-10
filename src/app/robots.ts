import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/"],
      disallow: ["/oppskrifter?query="],
    },
    sitemap: ["https://bakdel.no/sitemap.xml"],
  };
}
