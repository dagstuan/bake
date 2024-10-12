import {
  defineType,
  defineArrayMember,
  BlockStyleDefinition,
  BlockListDefinition,
  BlockMarksDefinition,
  BlockDecoratorDefinition,
} from "sanity";
import { CodeBlockIcon, ImageIcon } from "@sanity/icons";
import { HighlightDecorator } from "./decorators/highlight";

/**
 * This is the schema type for block content used in the post document type
 * Importing this type into the studio configuration's `schema` property
 * lets you reuse it in other document types with:
 *  {
 *    name: 'someName',
 *    title: 'Some title',
 *    type: 'blockContent'
 *  }
 */

export const baseBlockStyles: BlockStyleDefinition[] = [
  { title: "Normal", value: "normal" },
  { title: "H2", value: "h2" },
  { title: "H3", value: "h3" },
  { title: "H4", value: "h4" },
  { title: "Quote", value: "blockquote" },
];

export const baseBlockLists: BlockListDefinition[] = [
  { title: "Bullet", value: "bullet" },
];

export const baseBlockDecorators: BlockDecoratorDefinition[] = [
  { title: "Strong", value: "strong" },
  { title: "Emphasis", value: "em" },
  {
    title: "Highlight",
    value: "highlight",
    icon: CodeBlockIcon,
    component: HighlightDecorator,
  },
];

export const baseBlockAnnotations: BlockMarksDefinition["annotations"] = [
  {
    title: "URL",
    name: "link",
    type: "object",
    fields: [
      {
        title: "URL",
        name: "href",
        type: "url",
      },
    ],
  },
];

export const baseBlockMarks: BlockMarksDefinition = {
  decorators: baseBlockDecorators,
  annotations: baseBlockAnnotations,
};

export const baseBlockFields = [
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
];

export const blockContentType = defineType({
  title: "Block Content",
  name: "blockContent",
  type: "array",
  of: baseBlockFields,
});
