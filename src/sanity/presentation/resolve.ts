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
  {
    route: "/",
    filter: `_type == "home"`,
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
  home: defineLocations({
    message: "This document is used to render the front page",
    tone: "positive",
    locations: [{ title: "Home", href: "/" }],
  }),
};

export const resolve: PresentationPluginOptions["resolve"] = {
  mainDocuments,
  locations,
};
