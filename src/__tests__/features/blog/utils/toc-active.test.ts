import { describe, expect, it } from "vitest";
import { pickActiveId } from "#/features/blog/utils/toc-active";

describe("pickActiveId", () => {
  const ordered = ["intro", "usage", "api", "faq"];

  it("returns the only visible heading", () => {
    expect(pickActiveId(ordered, new Set(["usage"]), null)).toBe("usage");
  });

  it("returns the topmost visible heading in document order", () => {
    expect(pickActiveId(ordered, new Set(["faq", "usage"]), "intro")).toBe(
      "usage",
    );
  });

  it("keeps the previous id when nothing is visible", () => {
    expect(pickActiveId(ordered, new Set(), "usage")).toBe("usage");
  });

  it("returns null when nothing is visible and there is no previous id", () => {
    expect(pickActiveId(ordered, new Set(), null)).toBeNull();
  });

  it("ignores visible ids that are not part of the toc", () => {
    expect(pickActiveId(ordered, new Set(["unknown"]), "api")).toBe("api");
  });
});
