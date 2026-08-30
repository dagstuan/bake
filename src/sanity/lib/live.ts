import { cookies, draftMode } from "next/headers";
import type { QueryParams, StegaBranded } from "next-sanity";
import {
  defineLive,
  resolvePerspectiveFromCookies,
  type LivePerspective,
} from "next-sanity/live";
import { token } from "./token";
import { client } from "./client";

export type StegaAware<T> = T | StegaBranded<T>;

export const { sanityFetch, SanityLive } = defineLive({
  client,
  browserToken: token,
  serverToken: token,
  strict: true,
});

export interface DynamicFetchOptions {
  perspective: LivePerspective;
  stega: boolean;
}

export async function getDynamicFetchOptions(): Promise<DynamicFetchOptions> {
  const { isEnabled: isDraftMode } = await draftMode();

  if (!isDraftMode) {
    return { perspective: "published", stega: false };
  }

  const jar = await cookies();
  const perspective = await resolvePerspectiveFromCookies({ cookies: jar });

  return { perspective: perspective ?? "drafts", stega: true };
}

export async function sanityFetchStaticParams<
  const QueryString extends string,
>({ query, params = {} }: { query: QueryString; params?: QueryParams }) {
  "use cache";

  return sanityFetch({
    query,
    params,
    perspective: "published",
    stega: false,
  });
}

export async function sanityFetchMetadata<const QueryString extends string>({
  query,
  params = {},
  perspective,
}: {
  query: QueryString;
  params?: QueryParams;
  perspective: LivePerspective;
}) {
  "use cache";

  return sanityFetch({ query, params, perspective, stega: false });
}
