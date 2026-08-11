import { describe, expect, it } from "vitest";

import { pickActiveId } from "#/utils/toc-active";

describe("pickActiveId", () => {
  const ordered = ["global", "global-hackernews", "global-lobsters", "japan"];

  it("returns the only visible heading", () => {
    expect(pickActiveId(ordered, new Set(["global-hackernews"]), null)).toBe("global-hackernews");
  });

  it("returns the topmost visible heading in document order", () => {
    expect(pickActiveId(ordered, new Set(["japan", "global-lobsters"]), "global")).toBe(
      "global-lobsters",
    );
  });

  it("keeps the previous id when nothing is visible", () => {
    expect(pickActiveId(ordered, new Set(), "global-lobsters")).toBe("global-lobsters");
  });

  it("returns null when nothing is visible and there is no previous id", () => {
    expect(pickActiveId(ordered, new Set(), null)).toBeNull();
  });

  it("ignores visible ids that are not part of the toc", () => {
    expect(pickActiveId(ordered, new Set(["unknown"]), "japan")).toBe("japan");
  });
});
