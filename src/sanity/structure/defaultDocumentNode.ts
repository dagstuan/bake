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
import { aboutType } from "../schemaTypes/singletons/aboutType";
import { homeType } from "../schemaTypes/singletons/homeType";
import { ingredientType } from "../schemaTypes/ingredientType";
import DocumentsPane from "sanity-plugin-documents-pane";
import { recipeIngredientType } from "../schemaTypes/recipe/recipeIngredientType";
import { categoryType } from "../schemaTypes/categoryType";

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
    case aboutType.name:
    case homeType.name:
      return S.document().views([
        S.view.form().icon(DocumentIcon),
        S.view
          .component(Iframe)
          .icon(EyeOpenIcon)
          .options(createIframeOptions(S.context))
          .title("Preview"),
      ]);
    case ingredientType.name:
      return S.document().views([
        S.view.form().icon(DocumentIcon),
        S.view
          .component(DocumentsPane)
          .icon(() => "📜")
          .options({
            query:
              '*[_type == "recipe" && count((ingredients[]._ref)[@ in *[references($id)]._id]) > 0]',
            params: { id: `_id` },
            options: { perspective: "previewDrafts" },
          })
          .title("Used in recipes"),
      ]);
    case recipeIngredientType.name:
      return S.document().views([
        S.view.form().icon(DocumentIcon),
        S.view
          .component(DocumentsPane)
          .icon(() => "📜")
          .options({
            query: "*[references($id)]",
            params: { id: `_id` },
            options: { perspective: "previewDrafts" },
          })
          .title("Used in recipes"),
      ]);
    case categoryType.name:
      return S.document().views([
        S.view.form().icon(DocumentIcon),
        S.view
          .component(DocumentsPane)
          .icon(() => "📜")
          .options({
            query: '*[_type == "recipe" && references($id)]',
            params: { id: `_id` },
            options: { perspective: "previewDrafts" },
          })
          .title("Recipes"),
      ]);
    default:
      return S.document().views([S.view.form().icon(DocumentIcon)]);
  }
};
