import { DocumentDefinition } from "sanity";
import type { StructureResolver } from "sanity/structure";
import { apiVersion } from "../env";

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const resolveStructure = (
  singletonItems: DocumentDefinition[],
): StructureResolver => {
  return (S) => {
    const singletonChilds = singletonItems.map((typeDef) => {
      return S.listItem()
        .title(typeDef.title ?? typeDef.name)
        .icon(typeDef.icon)
        .child(
          S.defaultDocument({
            schemaType: typeDef.name,
            documentId: typeDef.name,
          }),
        );
    });

    return S.list()
      .title("Structure")
      .items([
        ...singletonChilds,
        S.divider(),
        S.documentTypeListItem("recipe").title("Recipes"),
        S.documentTypeListItem("ingredient").title("Ingredients"),
        S.listItem()
          .title("Recipe ingredients by recipe")
          .icon(() => "🥘")
          .child(
            S.documentTypeList("recipe")
              .title("Recipes")
              .child((documentId) => {
                return S.documentTypeList("recipeIngredient")
                  .title("Ingredients")
                  .apiVersion(apiVersion)
                  .filter(
                    `_type == "recipeIngredient" && count(*[_type == "recipe" && _id == $documentId && references(^._id)]) > 0`,
                  )
                  .params({ documentId });
              }),
          ),
        S.documentTypeListItem("category").title("Categories"),
        S.divider(),
        S.listItem()
          .title("Unused documents")
          .icon(() => "❌")
          .child(
            S.documentList()
              .title("Unused documents")
              .apiVersion(apiVersion)
              .filter(
                '_type != "recipe" && _type != "home" && _type != "about" && count(*[references(^._id)]) == 0',
              ),
          ),
        ...S.documentTypeListItems().filter(
          (item) =>
            item.getId() &&
            ![
              "ingredient",
              "recipe",
              "category",
              "recipeIngredient",
              ...singletonChilds.map((c) => c.getId()),
            ].includes(item.getId()),
        ),
      ]);
  };
};
