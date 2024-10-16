import { defineType, defineArrayMember } from "sanity";
import { ImageIcon } from "@sanity/icons";
import { alertType } from "../alertType";
import { baseBlockStyles } from "./baseBlockStyles";
import { baseBlockLists } from "./baseBlockLists";
import { baseBlockMarks } from "./baseBlockMarks";

export const blockContentType = defineType({
  title: "Block Content",
  name: "blockContent",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      styles: baseBlockStyles,
      lists: baseBlockLists,
      marks: baseBlockMarks,
    }),
    defineArrayMember({
      type: "image",
      icon: ImageIcon,
      options: { hotspot: true },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alternative Text",
        },
      ],
    }),
    defineArrayMember({
      type: alertType.name,
      icon: () => "⚠️",
    }),
  ],
});
