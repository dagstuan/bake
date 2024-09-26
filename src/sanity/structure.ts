import type { StructureResolver } from "sanity/structure";

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Blog")
    .items([
      S.documentTypeListItem("ingredient").title("Ingredients"),
      S.documentTypeListItem("recipe").title("Recipes"),
      S.documentTypeListItem("category").title("Categories"),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (item) =>
          item.getId() &&
          !["ingredient", "recipe", "category"].includes(item.getId()!),
      ),
    ]);
