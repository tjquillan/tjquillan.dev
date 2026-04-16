import type { APIRoute, GetStaticPaths, InferGetStaticPropsType } from "astro";

import { getPublishedPosts } from "../../../lib/blog";
import { generateOgImage } from "../../../lib/og";

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getPublishedPosts();
  return posts.map((post) => ({
    params: { slug: post.id },
    props: { title: post.data.title, description: post.data.description },
  }));
};

type Props = InferGetStaticPropsType<typeof getStaticPaths>;

export const GET: APIRoute = async (context) => {
  const { title, description } = context.props as Props;
  const png = await generateOgImage(title, description, "post");

  return new Response(png.buffer as ArrayBuffer, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};
