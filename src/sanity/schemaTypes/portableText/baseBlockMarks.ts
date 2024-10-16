import { CodeBlockIcon } from "@sanity/icons";
import { BlockDecoratorDefinition, BlockMarksDefinition } from "sanity";
import { HighlightDecorator } from "../decorators/highlight";

const baseBlockDecorators: BlockDecoratorDefinition[] = [
  { title: "Strong", value: "strong" },
  { title: "Emphasis", value: "em" },
  {
    title: "Highlight",
    value: "highlight",
    icon: CodeBlockIcon,
    component: HighlightDecorator,
  },
];

const baseBlockAnnotations: BlockMarksDefinition["annotations"] = [
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
