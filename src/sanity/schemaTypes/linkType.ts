import { defineField, defineType, type Reference } from "sanity";
import { recipeTypeName } from "./recipe/constants";
import { hasField } from "../utils";
import { aboutTypeName, homeTypeName, linkTypeName } from "./constants";
import { LinkIcon } from "@sanity/icons";

export const linkTypeFieldName = "linkType";

const fields = [
  defineField({
    name: linkTypeFieldName,
    title: "Link type",
    description:
      "The type of the link. If you want to link to an internal page, select 'internal'. External links should only be used for linking to external websites.",
    type: "string",
    options: {
      list: [
        { title: "Internal", value: "internal" },
        { title: "External", value: "external" },
      ],
      layout: "radio",
    },
    validation: (rule) => rule.required(),
  }),
  defineField({
    name: "internalReference",
    type: "reference",
    title: "Internal link",
    description: "Reference to another internal page",
    to: [
      { type: recipeTypeName },
      { type: aboutTypeName },
      { type: homeTypeName },
    ],
    hidden: ({ parent }: { parent?: { linkType: string } }) =>
      parent?.linkType !== "internal",
    validation: (rule) =>
      rule.custom((value: Reference | undefined, { parent }) => {
        if (
          hasField(parent, linkTypeFieldName) &&
          parent.linkType === "internal" &&
          !value
        ) {
          return "Internal link is required";
        }

        return true;
      }),
  }),
  defineField({
    name: "href",
    type: "url",
    title: "URL",
    description: "Must start with https://, mailto:, or tel:",
    hidden: ({ parent }: { parent?: { linkType: string } }) =>
      parent?.linkType !== "external",
    validation: (rule) =>
      rule
        .uri({
          allowRelative: true,
          scheme: ["https", "mailto", "tel"],
        })
        .custom((value, { parent }) => {
          if (
            hasField(parent, "linkType") &&
            parent.linkType === "external" &&
            !value
          ) {
            return "External link is required";
          }

          return true;
        }),
  }),
];

export const linkType = defineType({
  name: linkTypeName,
  title: "Link",
  type: "object",
  icon: LinkIcon,
  fields,
  preview: {
    select: {
      [linkTypeFieldName]: linkTypeFieldName,
      href: "href",
      internalReference: "internalReference.title",
    },
    prepare({ linkType, href, internalReference }) {
      if (linkType === "internal") {
        return {
          title: "Internal link",
          subtitle: (internalReference as string | null) ?? "Missing reference",
        };
      } else if (linkType === "external") {
        return {
          title: "External link",
          subtitle: (href as string | null) ?? "Missing URL",
        };
      }

      return { title: "Invalid link" };
    },
  },
});
