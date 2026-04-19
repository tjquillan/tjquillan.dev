import type { APIRoute } from "astro";

import { generateAppleTouchIcon } from "@/lib/favicon";

export const GET: APIRoute = async () => {
  const png = await generateAppleTouchIcon();

  return new Response(png.buffer as ArrayBuffer, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};
