import type { APIRoute } from "astro";

import rss from "@astrojs/rss";
import { getCollection } from "astro:content";

import { CONFIG } from "../config";
import { getPostUrl, getSortedPosts } from "../lib/blog";

export const GET: APIRoute = async ({ site }) => {
  if (!site) {
    throw new Error("Site URL is not defined. Please set it in the config.");
  }

  const posts = await getCollection("blog");
  const sortedPosts = getSortedPosts(posts);

  return rss({
    title: CONFIG.title,
    description: CONFIG.description,
    site: site,
    items: sortedPosts.map((page) => ({
      link: getPostUrl(page),
      title: page.data.title,
      description: page.data.description,
      pubDate: new Date(page.data.updatedDate ?? page.data.pubDate),
    })),
  });
};
