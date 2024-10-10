import {
  type StructureContext,
  type DefaultDocumentNodeResolver,
} from "sanity/structure";
import { Iframe, type IframeOptions } from "sanity-plugin-iframe-pane";
import { EyeOpenIcon } from "@radix-ui/react-icons";
import { apiVersion, draftModeRoute } from "../env";
import { resolveDocumentProductionUrl } from "../lib/resolveProductionUrl";
import { recipeType } from "../schemaTypes/recipe/recipeType";
import { DocumentIcon } from "@sanity/icons";

const createIframeOptions = (S: StructureContext): IframeOptions => ({
  url: {
    origin: "same-origin",
    preview: async (doc) => {
      if (doc !== null) {
        const client = S.getClient({ apiVersion });

        return await resolveDocumentProductionUrl(doc, client);
      }

      return "/";
    },
    draftMode: draftModeRoute,
  },
  reload: {
    button: true,
  },
});

export const defaultDocumentNode: DefaultDocumentNodeResolver = (
  S,
  { schemaType },
) => {
  switch (schemaType) {
    case recipeType.name:
      return S.document().views([
        S.view.form().icon(DocumentIcon),
        S.view
          .component(Iframe)
          .icon(EyeOpenIcon)
          .options(createIframeOptions(S.context))
          .title("Preview"),
      ]);
    default:
      return S.document().views([S.view.form().icon(DocumentIcon)]);
  }
};
