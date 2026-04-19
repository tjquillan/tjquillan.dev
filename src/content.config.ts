import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { kebabCase } from "es-toolkit";

import { CONFIG } from "@/config";

const blog = defineCollection({
  loader: glob({
    pattern: "**/*.mdx",
    base: `./src/content/blog`,
    generateId: ({ entry }) => kebabCase(entry.replace(/\.mdx$/, "")),
  }),
  schema: () =>
    z.object({
      title: z.string(),
      description: z.string(),
      author: z.string().default(CONFIG.author),
      pubDate: z.date(),
      updatedDate: z.date().optional(),
      draft: z.boolean().optional(),
      tags: z.array(z.string()).default([]),
    }),
});

export const collections = { blog };
