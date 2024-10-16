import { ComposeIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";
import { blockContentType } from "../portableText/blockContentType";

export const aboutType = defineType({
  name: "about",
  type: "document",
  title: "About",
  icon: () => "🧔‍♂️",
  groups: [
    { name: "content", title: "Content", icon: ComposeIcon, default: true },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Tittel",
      type: "string",
    }),
    defineField({
      name: "body",
      title: "Innhold",
      type: blockContentType.name,
    }),
  ],
});
