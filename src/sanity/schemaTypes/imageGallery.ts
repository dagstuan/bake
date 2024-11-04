import { defineField, defineType } from "sanity";
import { imageGalleryTypeName } from "./constants";
import ImageGalleryPreviewComponent from "../components/ImageGalleryPreviewComponent";

const fields = [
  {
    name: "images",
    type: "array",
    of: [
      defineField({
        name: "image",
        type: "image",
        options: { hotspot: true },
        fields: [
          defineField({
            name: "caption",
            type: "string",
            title: "Caption",
            description:
              "⚡ Optional but highly encouraged to contextualize readers as they navigate through your project's images.",
            validation: (rule) =>
              rule
                .required()
                .warning("Adding a caption will help contextualizing readers."),
          }),
          defineField({
            name: "alt",
            type: "string",
            title: "Alternative text",
            description:
              "Optional. If the caption above is descriptive enough, there's no need to fill this field. Else, consider adding alternative text to make content more accessible.",
          }),
        ],
      }),
    ],
    options: {
      layout: "grid",
    },
  },
  defineField({
    name: "columns",
    type: "number",
    title: "Columns",
    description:
      "The number of columns to display the images in. Default is 3.",
    initialValue: 3,
    validation: (rule) =>
      rule
        .min(1)
        .max(4)
        .error("The number of columns should be between 1 and 4."),
  }),
];

export const imageGalleryType = defineType({
  name: imageGalleryTypeName,
  type: "object",
  title: "Gallery",
  fields,
  preview: {
    select: {
      images: "images",
      columns: "columns",
    },
  },
  components: {
    preview: ImageGalleryPreviewComponent,
  },
});
