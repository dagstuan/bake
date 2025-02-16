import { linkTypeFieldName } from "@/sanity/schemaTypes/linkType";
import { defineMigration, at, set } from "sanity/migrate";

export default defineMigration({
  title: "Add link type",
  documentTypes: ["recipe", "about"],

  migrate: {
    object: (node) => {
      if (node._type === "link") {
        return at(linkTypeFieldName, set("external"));
      }
    },
  },
});
