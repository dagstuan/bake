import { ComposeIcon } from "@sanity/icons";
import { User } from "lucide-react";
import { defineField, defineType } from "sanity";
import { blockContentTypeName } from "../constants";

export const aboutType = defineType({
  name: "about",
  type: "document",
  title: "About",
  icon: () => <User size={16} />,
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
      type: blockContentTypeName,
    }),
  ],
});
