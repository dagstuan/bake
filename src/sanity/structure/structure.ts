import { DocumentDefinition } from "sanity";
import type { StructureResolver } from "sanity/structure";

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const resolveStructure = (
  singletonItems: Array<DocumentDefinition>,
): StructureResolver => {
  return (S) => {
    const singletonChilds = singletonItems.map((typeDef) => {
      return S.listItem()
        .title(typeDef.title ?? typeDef.name)
        .icon(typeDef.icon)
        .child(
          S.editor()
            .id(typeDef.name)
            .schemaType(typeDef.name)
            .documentId(typeDef.name),
        );
    });

    return S.list()
      .title("Structure")
      .items([
        ...singletonChilds,
        S.divider(),
        S.documentTypeListItem("ingredient").title("Ingredients"),
        S.documentTypeListItem("recipe").title("Recipes"),
        S.documentTypeListItem("category").title("Categories"),
        S.divider(),
        ...S.documentTypeListItems().filter(
          (item) =>
            item.getId() &&
            ![
              "ingredient",
              "recipe",
              "category",
              ...singletonChilds.map((c) => c.getId()),
            ].includes(item.getId()!),
        ),
      ]);
  };
};
