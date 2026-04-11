import type { APIRoute } from "astro";

import { generateFaviconIco } from "../lib/favicon";

export const GET: APIRoute = async () => {
  const ico = await generateFaviconIco();

  return new Response(ico, {
    headers: {
      "Content-Type": "image/x-icon",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};
