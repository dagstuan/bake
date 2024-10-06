import { defineField, defineType } from "sanity";

export const durationType = defineType({
  name: "duration",
  title: "Duration",
  type: "object",
  fields: [
    defineField({
      name: "start",
      type: "timeValue",
    }),
    defineField({
      name: "end",
      type: "timeValue",
    }),
  ],
  options: {
    collapsible: true,
    columns: 2,
  },
});
