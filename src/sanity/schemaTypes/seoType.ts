import { defineType } from "sanity";

export const seoType = defineType({
  name: "seo",
  title: "SEO",
  type: "object",
  fields: [
    {
      name: "metaTitle",
      type: "string",
      title: "Meta title",
      validation: (Rule) =>
        Rule.max(50).warning(
          "Longer titles may be truncated by search engines",
        ),
    },
    {
      name: "metaDescription",
      type: "text",
      title: "Meta description",
      validation: (Rule) =>
        Rule.max(150).warning(
          "Longer descriptions may be truncated by search engines",
        ),
    },
    {
      name: "openGraphImage",
      type: "image",
      title: "Open Graph image",
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alternative text",
        },
      ],
    },
  ],
  options: {
    collapsible: true,
    collapsed: false,
  },
});
