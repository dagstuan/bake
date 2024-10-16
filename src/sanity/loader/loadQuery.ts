import "server-only";

import * as queryStore from "@sanity/react-loader";
import { draftMode } from "next/headers";
import { type ClientReturn, type QueryParams } from "next-sanity";
import { type QueryResponseInitial } from "@sanity/react-loader";
import { getClient } from "@/sanity/lib/client";
import { token } from "../lib/token";

export type LoadQueryResult<TQuery extends string> = QueryResponseInitial<
  ClientReturn<TQuery>
>;

const serverClient = getClient(token).withConfig({
  // Enable stega if it's a Vercel preview deployment, as the Vercel Toolbar has controls that shows overlays
  stega: process.env.VERCEL_ENV === "preview",
});

/**
 * Sets the server client for the query store, doing it here ensures that all data fetching in production
 * happens on the server and not on the client.
 * Live mode in `sanity/presentation` still works, as it uses the `useLiveMode` hook to update `useQuery` instances with
 * live draft content using `postMessage`.
 */
queryStore.setServerClient(serverClient);

const usingCdn = serverClient.config().useCdn;

type Options = Parameters<typeof queryStore.loadQuery>[2];

export const loadQuery = async <TQuery extends string>(
  query: TQuery,
  params: QueryParams = {},
  options: Options = {},
): Promise<LoadQueryResult<TQuery>> => {
  const {
    perspective = draftMode().isEnabled ? "previewDrafts" : "published",
  } = options;
  // Don't cache by default
  // eslint-disable-next-line no-undef -- eslint borked
  let revalidate: NextFetchRequestConfig["revalidate"] = 0;
  // If `next.tags` is set, and we're not using the CDN, then it's safe to cache
  if (!usingCdn && Array.isArray(options.next?.tags)) {
    revalidate = false;
  } else if (usingCdn) {
    revalidate = 60;
  }

  return queryStore.loadQuery(query, params, {
    ...options,
    next: {
      revalidate,
      ...(options.next ?? {}),
    },
    perspective,
    stega:
      perspective === "previewDrafts" || process.env.VERCEL_ENV === "preview",
  });
};
