import type { CollectionEntry } from "astro:content";

import { describe, expect, it } from "vitest";

import { getSortedPosts } from "@/lib/blog";

function post(
  title: string,
  pubDate: string,
  updatedDate?: string,
): CollectionEntry<"blog"> {
  return {
    data: {
      title,
      pubDate: new Date(pubDate),
      updatedDate: updatedDate ? new Date(updatedDate) : undefined,
    },
  } as unknown as CollectionEntry<"blog">;
}

describe("getSortedPosts", () => {
  it("sorts posts from newest to oldest", () => {
    const posts = [
      post("Oldest", "2024-01-01"),
      post("Newest", "2026-01-01"),
      post("Middle", "2025-01-01"),
    ];

    expect(getSortedPosts(posts).map(({ data }) => data.title)).toEqual([
      "Newest",
      "Middle",
      "Oldest",
    ]);
  });

  it("uses the updated date when present", () => {
    const posts = [
      post("Recently updated", "2024-01-01", "2026-01-01"),
      post("Recently published", "2025-01-01"),
    ];

    expect(getSortedPosts(posts).map(({ data }) => data.title)).toEqual([
      "Recently updated",
      "Recently published",
    ]);
  });
});
