import type { APIRoute } from "astro";

import { CONFIG } from "@/config";
import { generateOgImage } from "@/lib/og";

export const GET: APIRoute = async (context) => {
  const png = await generateOgImage(
    CONFIG.title,
    CONFIG.description,
    undefined,
    context.url,
  );

  return new Response(png.buffer as ArrayBuffer, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};
