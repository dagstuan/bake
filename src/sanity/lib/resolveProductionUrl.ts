import { createPreviewSecret } from "@sanity/preview-url-secret/create-secret";
import {
  type SanityClient,
  type SanityDocumentLike,
  type DocumentPluginOptions,
  type ResolveProductionUrlContext,
} from "sanity";
import { apiVersion, draftModeRoute } from "../env";
import { pageSlugQuery } from "./queries";

const resolvableDocumentTypes = ["recipe", "category", "home"];

export const resolveDocumentProductionUrl = async (
  document: SanityDocumentLike,
  client: SanityClient,
): Promise<string> => {
  const doc = await client.fetch(pageSlugQuery, {
    pageId: document._id,
  });

  switch (doc?._type) {
    case "recipe":
      return `/oppskrifter/${doc.slug}`;
    case "category":
      return `/kategorier/${doc.slug}`;
    case "home":
      return "/";
    default:
      return "";
  }
};

/**
 * This is what we provide to `sanity.config.ts`.
 */
export const resolvePagePreviewUrl: DocumentPluginOptions["productionUrl"] =
  async (
    prev: string | undefined,
    context: ResolveProductionUrlContext,
  ): Promise<string | undefined> => {
    const { document } = context;
    if (document._type in resolvableDocumentTypes) {
      return (await generatePagePreviewUrl(context)) ?? prev;
    }
    return prev;
  };

/**
 * Returns a preview URL for a given "page" document, or undefined if not possible.
 * Doesn't return real URLs, instead wraps them in a `draftMode` request with a sanity token.
 */
async function generatePagePreviewUrl(
  context: ResolveProductionUrlContext,
): Promise<string | undefined> {
  const { getClient, document } = context;
  const client = getClient({ apiVersion });

  // Resolve the real (possibly absolute) url with our own custom logic based on `next-intl`
  const resolvedUrl = await resolveDocumentProductionUrl(document, client);

  const { secret } = await createPreviewSecret(
    client,
    "@sanity/presentation",
    typeof window === "undefined" ? "" : location.href,
  );

  const enablePreviewModeUrl = new URL(
    draftModeRoute,
    typeof location === "undefined" ? "https://localhost" : location.origin,
  );
  enablePreviewModeUrl.searchParams.set("sanity-preview-secret", secret);
  enablePreviewModeUrl.searchParams.set("sanity-preview-pathname", resolvedUrl);
  return enablePreviewModeUrl.toString();
}
