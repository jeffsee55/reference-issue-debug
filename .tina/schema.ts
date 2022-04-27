import { defineSchema, defineConfig } from "tinacms";

// Tina schema

// =================
// This is where you can define the shape of your content
export default defineSchema({
  collections: [
    {
      label: "Pages",
      name: "pages",
      path: "content/page",
      fields: [
        {
          type: "string",
          name: "title",
          label: "Title",
        },
        {
          type: "reference",
          name: "backgroundColourReference",
          label: "Background colour reference field",
          collections: ["colours"],
        },
        {
          type: "string",
          name: "backgroundColourDropdown",
          label: "Background colour dropdown field",
          options: ["colour 1", "colour 2", "colour 3"],
        },
      ],
    },
    {
      label: "Colours",
      name: "colours",
      path: "content/colours",
      format: "json",
      fields: [
        {
          type: "string",
          name: "rgbColour",
          label: "Colour",
          ui: {
            component: "color",
            colorFormat: "rgb",
          },
        },
      ],
    },
  ],
});

// ===============

// Tina config

const branch = "main";
// When working locally, hit our local filesystem.
// On a Vercel deployment, hit the Tina Cloud API
const apiURL =
  process.env.NODE_ENV == "development"
    ? "http://localhost:4001/graphql"
    : `https://content.tinajs.io/content/${process.env.NEXT_PUBLIC_TINA_CLIENT_ID}/github/${branch}`;

export const tinaConfig = defineConfig({
  cmsCallback: (cms) => {
    import("tinacms").then(({ RouteMappingPlugin }) => {
      const RouteMapping = new RouteMappingPlugin((collection, document) => {
        if (["page"].includes(collection.name)) {
          if (document.sys.filename === "home") {
            return "/";
          }
        }

        if (["post"].includes(collection.name)) {
          return `/posts/${document.sys.filename}`;
        }

        return undefined;
      });

      cms.plugins.add(RouteMapping);
    });
    return cms;
  },
  apiURL,
});
