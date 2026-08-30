import { describe, expect, it } from "vitest";
import { splitSourceRefs } from "#/utils/source-refs";

describe("splitSourceRefs", () => {
  it("returns plain text untouched", () => {
    expect(splitSourceRefs("逸脱なし。")).toEqual([{ kind: "text", text: "逸脱なし。" }]);
  });

  it("splits path:line references out of prose", () => {
    expect(
      splitSourceRefs(
        "opacity に落とすもの: packages/ui/src/site-header.astro:68、apps/memo/src/components/avatar.astro:44",
      ),
    ).toEqual([
      { kind: "text", text: "opacity に落とすもの: " },
      { kind: "ref", path: "packages/ui/src/site-header.astro", line: 68 },
      { kind: "text", text: "、" },
      { kind: "ref", path: "apps/memo/src/components/avatar.astro", line: 44 },
    ]);
  });

  it("handles dynamic route file names and trailing punctuation", () => {
    expect(splitSourceRefs("残る(apps/lgtm/src/pages/[...page].astro:149)。")).toEqual([
      { kind: "text", text: "残る(" },
      { kind: "ref", path: "apps/lgtm/src/pages/[...page].astro", line: 149 },
      { kind: "text", text: ")。" },
    ]);
  });

  it("returns an empty list for an empty string", () => {
    expect(splitSourceRefs("")).toEqual([]);
  });
});
