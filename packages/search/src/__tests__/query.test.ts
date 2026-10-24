import { describe, expect, it } from "vitest";
import { normalizeQuery, toResultHref, toSectionHref } from "../query";

describe("normalizeQuery", () => {
  it("trims surrounding whitespace", () => {
    expect(normalizeQuery("  astro  ")).toBe("astro");
  });

  it("collapses runs of whitespace, including ideographic spaces", () => {
    expect(normalizeQuery("分散型　　SNS   構築")).toBe("分散型 SNS 構築");
  });

  it("returns an empty string for whitespace-only input", () => {
    expect(normalizeQuery(" \t\n　")).toBe("");
  });
});

describe("toResultHref", () => {
  it("strips the .html extension Pagefind reports for file-format builds", () => {
    expect(toResultHref("/posts/01kamfkgq06rsnxh0aqart3bp1.html")).toBe(
      "/posts/01kamfkgq06rsnxh0aqart3bp1",
    );
  });

  it("leaves extensionless URLs untouched", () => {
    expect(toResultHref("/posts/01kamfkgq06rsnxh0aqart3bp1")).toBe(
      "/posts/01kamfkgq06rsnxh0aqart3bp1",
    );
  });
});

describe("toSectionHref", () => {
  it("drops .html and keeps the heading fragment", () => {
    expect(toSectionHref("/components.html#search-dialog")).toBe("/components#search-dialog");
  });

  it("handles the page itself", () => {
    expect(toSectionHref("/components.html")).toBe("/components");
    expect(toSectionHref("/index.html")).toBe("/");
  });
});
