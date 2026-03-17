import type { APIRoute } from "astro";

import rss from "@astrojs/rss";

import { CONFIG } from "../config";

export const GET: APIRoute = ({ site }) => {
  if (!site) {
    throw new Error("Site URL is not defined. Please set it in the config.");
  }

  return rss({
    title: CONFIG.title,
    description: CONFIG.description,
    site: site,
    items: [],
  });
};
