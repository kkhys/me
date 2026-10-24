import { describe, expect, it } from "vitest";
import { isDocPage } from "#/utils/pagefind-index";

describe("isDocPage", () => {
  it("keeps the html files and drops assets and directories", () => {
    expect(
      ["index.html", "components.html", "favicon.svg", "preview", "_astro"].filter((name) =>
        isDocPage(name),
      ),
    ).toEqual(["index.html", "components.html"]);
  });
});
