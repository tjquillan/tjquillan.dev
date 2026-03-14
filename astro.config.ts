import { defineConfig, fontProviders } from "astro/config";

import sitemap from "@astrojs/sitemap";

import tailwindcss from "@tailwindcss/vite";
import { CONFIG } from "./src/config";

import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
  site: CONFIG.website,
  integrations: [sitemap(), mdx()],
  fonts: [
    {
      name: "Google Sans Code",
      cssVariable: "--font-google-sans-code",
      provider: fontProviders.google(),
      fallbacks: ["monospace"],
      weights: [300, 400, 500, 600, 700],
      styles: ["normal", "italic"],
    },
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
