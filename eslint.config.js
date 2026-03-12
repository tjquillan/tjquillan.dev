import { defineConfig, globalIgnores } from "eslint/config";
import eslint from "@eslint/js";
import eslintPluginAstro from "eslint-plugin-astro";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier/flat";

export default defineConfig(
  globalIgnores(["dist/", ".astro/", "public/pagefind/"]),
  eslint.configs.recommended,
  tseslint.configs.strict,
  eslintPluginAstro.configs.recommended,
  eslintConfigPrettier,
);
