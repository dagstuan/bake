import { createClient, type SanityClient } from "next-sanity";
import { apiVersion, dataset, projectId, studioUrl } from "../env";

export const getClient = (previewToken?: string): SanityClient => {
  return createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: !previewToken,
    perspective: previewToken ? "previewDrafts" : "published",
    stega: {
      enabled: Boolean(previewToken),
      studioUrl,
    },
    token: previewToken,
  });
};
