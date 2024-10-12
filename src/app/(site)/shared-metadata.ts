import { Metadata } from "next";

export const siteUrl = "https://www.bakdel.no";
export const creator = "Dag Stuan";

export const openGraphMetadata: Metadata["openGraph"] = {
  locale: "no_NO",
  type: "website",
  url: siteUrl,
  siteName: "Bakdel.no",
};

export const twitterMetadata: Metadata["twitter"] = {
  card: "summary_large_image",
  title: "Bakdel",
  creator: creator,
};
