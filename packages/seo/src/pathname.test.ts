import { describe, expect, it } from "vitest";
import { normalizePathname } from "./pathname";

describe("normalizePathname", () => {
  it("maps the built index page back to the site root", () => {
    expect(normalizePathname("/index.html")).toBe("/");
  });

  it("maps a nested index page back to its directory", () => {
    expect(normalizePathname("/blog/index.html")).toBe("/blog");
  });

  it("strips a .html suffix", () => {
    expect(normalizePathname("/privacy.html")).toBe("/privacy");
    expect(normalizePathname("/privacy/ja.html")).toBe("/privacy/ja");
  });

  it("only treats a whole `index` segment as the directory index", () => {
    expect(normalizePathname("/reindex.html")).toBe("/reindex");
  });

  it("strips a trailing slash", () => {
    expect(normalizePathname("/blog/2/")).toBe("/blog/2");
  });

  it("keeps the root slash", () => {
    expect(normalizePathname("/")).toBe("/");
  });

  it("leaves clean paths untouched", () => {
    expect(normalizePathname("/blog")).toBe("/blog");
  });
});
