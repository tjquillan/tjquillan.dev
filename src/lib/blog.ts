import type { CollectionEntry } from "astro:content";

import { getCollection } from "astro:content";
import { kebabCase } from "es-toolkit";

export function getPostUrl(post: CollectionEntry<"blog">): string {
  return `/posts/${post.id}`;
}

export function isPublishedPost(
  postData: CollectionEntry<"blog">["data"],
): boolean {
  return !postData.draft;
}

export async function getPublishedPosts(): Promise<CollectionEntry<"blog">[]> {
  return getCollection(
    "blog",
    ({ data }) => import.meta.env.DEV || isPublishedPost(data),
  );
}

export function getSortedPosts(
  posts: CollectionEntry<"blog">[],
): CollectionEntry<"blog">[] {
  return posts.sort(
    (a, b) =>
      (a.data.updatedDate ?? a.data.pubDate).valueOf() -
      (b.data.updatedDate ?? b.data.pubDate).valueOf(),
  );
}

export function getUniqueTags(posts: CollectionEntry<"blog">[]): string[] {
  const tags = posts.flatMap((post) => post.data.tags);
  return [...new Set(tags)].sort();
}

export function getTagSlug(tag: string): string {
  return kebabCase(tag);
}

export function getTagUrl(tag: string): string {
  return `/tags/${tag}`;
}

export function getPostsByTag(
  tag: string,
  posts: CollectionEntry<"blog">[],
): CollectionEntry<"blog">[] {
  return posts.filter((post) => post.data.tags.includes(tag));
}
