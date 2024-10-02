import {
  defineDocuments,
  defineLocations,
  PresentationPluginOptions,
} from "sanity/presentation";

const mainDocuments = defineDocuments([
  {
    route: "/oppskrifter/:slug",
    filter: `_type == "recipe" && slug.current == $slug`,
  },
]);

const locations = {
  recipe: defineLocations({
    select: {
      title: "title",
      slug: "slug.current",
    },
    resolve: (doc) => ({
      locations: [
        {
          title: doc?.title || "Untitled",
          href: `/oppskrifter/${doc?.slug}`,
        },
        {
          title: "Alle oppskrifter",
          href: "/oppskrifter",
        },
      ],
    }),
  }),
};

export const resolve: PresentationPluginOptions["resolve"] = {
  mainDocuments,
  locations,
};
