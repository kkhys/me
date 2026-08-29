import { describe, expect, it } from "vitest";
import { buildSearchOptions, normalizeQuery, toResultHref } from "#/features/search/utils/query";

describe("normalizeQuery", () => {
  it("trims surrounding whitespace", () => {
    expect(normalizeQuery("  mastodon  ")).toBe("mastodon");
  });

  it("collapses runs of whitespace, including ideographic spaces", () => {
    expect(normalizeQuery("分散型　　SNS   構築")).toBe("分散型 SNS 構築");
  });

  it("returns an empty string for whitespace-only input", () => {
    expect(normalizeQuery(" \t\n　")).toBe("");
  });
});

describe("buildSearchOptions", () => {
  it("returns no filters when no category is selected", () => {
    expect(buildSearchOptions(undefined)).toEqual({});
    expect(buildSearchOptions("")).toEqual({});
  });

  it("filters by the selected category", () => {
    expect(buildSearchOptions("Tech")).toEqual({ filters: { category: "Tech" } });
  });
});

describe("toResultHref", () => {
  it("strips the .html extension Pagefind reports for file-format builds", () => {
    expect(toResultHref("/blog/posts/b1e2lej.html")).toBe("/blog/posts/b1e2lej");
  });

  it("leaves extensionless URLs untouched", () => {
    expect(toResultHref("/blog/posts/b1e2lej")).toBe("/blog/posts/b1e2lej");
  });
});
