import { ComposeIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

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
    {
      name: "body",
      title: "Innhold",
      type: "blockContent",
    },
  ],
});
