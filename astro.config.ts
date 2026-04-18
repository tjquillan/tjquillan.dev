import type { AstroExpressiveCodeOptions } from "astro-expressive-code";

import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import copyIcon from "@tabler/icons/outline/copy.svg?raw";
import tailwindcss from "@tailwindcss/vite";
import expressiveCode, { createInlineSvgUrl } from "astro-expressive-code";
import pagefind from "astro-pagefind";
import { defineConfig, fontProviders } from "astro/config";

import { CONFIG } from "./src/config";
import { codeOutputPlugin } from "./src/plugins/expressive-code/code-output";

const expressiveCodeOptions: AstroExpressiveCodeOptions = {
  themes: ["one-dark-pro"],
  plugins: [codeOutputPlugin()],
  styleOverrides: {
    borderColor: "var(--border)",
    codeFontFamily: "var(--font-google-sans-code)",
    codeBackground: "var(--muted)",
    codeForeground: "var(--foreground)",
    focusBorder: "var(--accent)",
    gutterHighlightForeground: "var(--foreground)",
    uiFontFamily: "var(--font-google-sans-code)",
    frames: {
      copyIcon: createInlineSvgUrl(copyIcon),
      editorActiveTabBackground: "var(--muted)",
      editorActiveTabForeground: "var(--foreground)",
      editorActiveTabBorderColor: "var(--border)",
      editorActiveTabIndicatorBottomColor: "var(--muted)",
      editorTabBarBackground: "var(--background)",
      editorTabBarBorderColor: "var(--border)",
      editorTabBarBorderBottomColor: "var(--border)",
      editorBackground: "var(--muted)",
      terminalTitlebarBackground: "var(--background)",
      terminalTitlebarForeground: "var(--foreground)",
      terminalTitlebarBorderBottomColor: "var(--border)",
      terminalTitlebarDotsForeground: "var(--accent)",
      terminalBackground: "var(--muted)",
      inlineButtonForeground: "var(--accent)",
      inlineButtonBackground: "var(--accent)",
      inlineButtonBorder: "var(--accent)",
      tooltipSuccessBackground: "var(--accent)",
      tooltipSuccessForeground: "var(--background)",
    },
  },
};

// https://astro.build/config
export default defineConfig({
  site: CONFIG.website,
  integrations: [
    sitemap(),
    expressiveCode(expressiveCodeOptions),
    mdx(),
    pagefind(),
  ],
  fonts: [
    {
      name: "Google Sans Code",
      cssVariable: "--font-google-sans-code",
      provider: fontProviders.google(),
      fallbacks: ["monospace"],
      weights: [300, 400, 500, 600, 700],
      styles: ["normal", "italic"],
      formats: ["woff2", "ttf"],
    },
  ],
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      exclude: ["@resvg/resvg-js"],
    },
  },
});
