import { version } from "typescript";

/**
 * @see https://prettier.io/docs/configuration
 * @type {import("prettier").Config
 *  & import("prettier-plugin-tailwindcss").PluginOptions
 *  & import("@ianvs/prettier-plugin-sort-imports").PluginConfig}
 */
const config = {
  plugins: [
    "prettier-plugin-astro",
    "prettier-plugin-tailwindcss",
    "@ianvs/prettier-plugin-sort-imports",
  ],
  tailwindStylesheet: "./src/styles/global.css",
  importOrder: [
    "<TYPES>",
    "<TYPES>^(?:@/|@public/|[.])",
    "",
    "<BUILTIN_MODULES>",
    "<THIRD_PARTY_MODULES>",
    "",
    "^(?:@/|@public/|[.])",
  ],
  importOrderTypeScriptVersion: version,
  overrides: [
    {
      files: "*.astro",
      options: {
        parser: "astro",
      },
    },
  ],
};

export default config;
