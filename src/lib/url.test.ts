import { describe, expect, it } from "vitest";

import { getNormalizedPathname, isActivePathname } from "@/lib/url";

function toURL(path: string) {
  return new URL(path, "https://example.com");
}

describe("getNormalizedPathname", () => {
  it("leaves non-trailing-slash paths unchanged", () => {
    expect(getNormalizedPathname(toURL("/posts"))).toBe("/posts");
  });

  it("removes a single trailing slash", () => {
    expect(getNormalizedPathname(toURL("/posts/"))).toBe("/posts");
  });

  it("removes multiple trailing slashes", () => {
    expect(getNormalizedPathname(toURL("/posts///"))).toBe("/posts");
  });

  it("removes trailing slashes for the root path", () => {
    expect(getNormalizedPathname(toURL("/"))).toBe("");
  });
});

describe("isActivePathname", () => {
  it("returns true for exact matches", () => {
    expect(isActivePathname("/posts", "/posts")).toBe(true);
  });

  it("returns true when the current path is a child of the pathname", () => {
    expect(isActivePathname("/posts/2024/hello", "/posts")).toBe(true);
  });

  it("returns false for non-matching paths", () => {
    expect(isActivePathname("/about", "/posts")).toBe(false);
  });

  it("returns false when only a partial segment matches", () => {
    expect(isActivePathname("/posts-archive", "/posts")).toBe(false);
  });

  it("returns true for the root pathname when current path is root", () => {
    expect(isActivePathname("/", "/")).toBe(true);
  });
});
