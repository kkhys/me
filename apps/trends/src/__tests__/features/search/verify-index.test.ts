import { describe, expect, it } from "vitest";

import { isDigestPage } from "#/features/search/verify-index";

describe("isDigestPage", () => {
  it("keeps the dated pages and drops the duplicate home, the other pages and assets", () => {
    expect(
      [
        "2026-08-10.html",
        "2026-10-24.html",
        "index.html",
        "archive.html",
        "about.html",
        "sitemap-index.xml",
        "_astro",
        "pagefind",
      ].filter((name) => isDigestPage(name)),
    ).toEqual(["2026-08-10.html", "2026-10-24.html"]);
  });

  it("requires the exact date shape", () => {
    expect(isDigestPage("2026-8-10.html")).toBe(false);
    expect(isDigestPage("x2026-08-10.html")).toBe(false);
    expect(isDigestPage("2026-08-10")).toBe(false);
  });
});
