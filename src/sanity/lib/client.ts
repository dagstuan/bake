import { createClient, QueryParams } from "next-sanity";
import { apiVersion, dataset, projectId, studioUrl } from "../env";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  stega: { studioUrl },
});

export async function sanityFetchNonLive<const QueryString extends string>({
  query,
  params = {},
  revalidate = 60, // default revalidation time in seconds
  tags = [],
}: {
  query: QueryString;
  params?: QueryParams;
  revalidate?: number | false;
  tags?: string[];
}) {
  return client.fetch(query, params, {
    next: {
      revalidate: tags.length ? false : revalidate, // for simple, time-based revalidation
      tags, // for tag-based revalidation
    },
  });
}
