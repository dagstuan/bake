import { defineType } from "sanity";

export const timeValueType = defineType({
  name: "timeValue",
  title: "Time",
  type: "object",
  fields: [
    {
      name: "time",
      title: "Time",
      type: "number",
    },
    {
      name: "type",
      title: "Type",
      type: "string",
      options: {
        list: ["hours", "minutes", "seconds", "days"],
      },
    },
  ],
  options: {
    columns: 2,
  },
  preview: {
    select: {
      time: "time",
      type: "type",
    },
    prepare({ time, type }) {
      return {
        title: `${time} ${type}`,
      };
    },
  },
});
