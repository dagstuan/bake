import { createPreviewSecret } from "@sanity/preview-url-secret/create-secret";
import {
  type DocumentPluginOptions,
  type ResolveProductionUrlContext,
  type SanityClient,
  type SanityDocumentLike,
} from "sanity";
import { apiVersion, draftModeRoute } from "../env";
import { recipeTypeName } from "../schemaTypes/recipe/constants";
import { aboutType } from "../schemaTypes/singletons/aboutType";
import { homeType } from "../schemaTypes/singletons/homeType";
import { pageSlugQuery } from "./queries";

const resolvableDocumentTypes = [recipeTypeName, "category", "home"];

export const resolveDocumentProductionUrl = async (
  document: SanityDocumentLike,
  client: SanityClient,
): Promise<string> => {
  const doc = await client.fetch(pageSlugQuery, {
    pageId: document._id,
  });

  switch (doc?._type) {
    case recipeTypeName:
      return `/oppskrifter/${doc.slug}`;
    case "category":
      return `/kategorier/${doc.slug}`;
    case homeType.name:
      return "/";
    case aboutType.name:
      return "/om";
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

    if (resolvableDocumentTypes.includes(document._type)) {
      const previewUrl = await generatePagePreviewUrl(context);
      return previewUrl ?? prev;
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
    "sanity/presentation",
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
