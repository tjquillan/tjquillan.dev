import type { CollectionEntry } from "astro:content";

import { describe, expect, it } from "vitest";

import { getSortedPosts, isPublishedPost } from "@/lib/blog";

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

describe("isPublishedPost", () => {
  it("includes published posts", () => {
    expect(isPublishedPost(post("Published", "2000-01-01").data)).toBe(true);
  });

  it("excludes draft posts", () => {
    const draft = post("Draft", "2000-01-01");
    draft.data.draft = true;

    expect(isPublishedPost(draft.data)).toBe(false);
  });

  it("excludes posts scheduled for the future", () => {
    expect(isPublishedPost(post("Scheduled", "2999-01-01").data)).toBe(false);
  });
});
