import { defineField, defineType } from "sanity";

export const aboutType = defineType({
  name: "about",
  type: "document",
  title: "About",
  icon: () => "🧔‍♂️",
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
