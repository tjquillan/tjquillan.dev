import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";
import { CONFIG } from "./config";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: `./src/content/blog` }),
  schema: () =>
    z.object({
      title: z.string(),
      description: z.string(),
      author: z.string().default(CONFIG.author),
      pubDate: z.date(),
      updatedDate: z.date().optional().nullable(),
      draft: z.boolean().optional(),
      tags: z.array(z.string()).default([]),
    }),
});

export const collections = { blog };
