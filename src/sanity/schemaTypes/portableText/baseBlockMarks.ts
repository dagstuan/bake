import { CodeBlockIcon } from "@sanity/icons";
import { BlockDecoratorDefinition, BlockMarksDefinition } from "sanity";
import { HighlightDecorator } from "../decorators/highlight";
import { linkTypeName } from "../constants";

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
    name: "link",
    title: "Link",
    type: linkTypeName,
  },
];

export const baseBlockMarks: BlockMarksDefinition = {
  decorators: baseBlockDecorators,
  annotations: baseBlockAnnotations,
};
