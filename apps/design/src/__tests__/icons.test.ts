import { describe, expect, it } from "vitest";
import { iconImportName, iconNameFromPath, parseSvgAttributes } from "#/utils/icons";

describe("parseSvgAttributes", () => {
  it("reads the root attributes of a Lucide glyph", () => {
    const svg =
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="m21 21-4.3-4.3"/></svg>';
    expect(parseSvgAttributes(svg)).toEqual({
      viewBox: "0 0 24 24",
      strokeWidth: "2",
      stroke: "currentColor",
      fill: "none",
    });
  });

  it("does not confuse stroke with stroke-width", () => {
    expect(parseSvgAttributes('<svg stroke-width="1.5"></svg>')).toEqual({
      viewBox: null,
      strokeWidth: "1.5",
      stroke: null,
      fill: null,
    });
  });

  it("ignores attributes on child elements", () => {
    expect(parseSvgAttributes('<svg><path fill="red" stroke="blue"/></svg>').fill).toBeNull();
  });
});

describe("iconNameFromPath", () => {
  it("strips the directory and extension", () => {
    expect(iconNameFromPath("../../../../packages/ui/src/icons/move-up-right.svg")).toBe(
      "move-up-right",
    );
    expect(iconNameFromPath("search.svg")).toBe("search");
  });
});

describe("iconImportName", () => {
  it("builds the PascalCase import name", () => {
    expect(iconImportName("search")).toBe("SearchIcon");
    expect(iconImportName("message-square-warning")).toBe("MessageSquareWarningIcon");
  });
});
