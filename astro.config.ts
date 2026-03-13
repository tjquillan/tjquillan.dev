import { defineConfig, fontProviders } from "astro/config";

import sitemap from "@astrojs/sitemap";

import tailwindcss from "@tailwindcss/vite";
import { CONFIG } from "./src/config";

// https://astro.build/config
export default defineConfig({
  site: CONFIG.website,
  integrations: [sitemap()],
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
