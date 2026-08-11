import { describe, expect, it } from "vitest";

import { splitParagraphs } from "#/utils/paragraphs";

describe("splitParagraphs", () => {
  it("splits on blank lines", () => {
    expect(splitParagraphs("第一段落。\n\n第二段落。\n\n第三段落。")).toEqual([
      "第一段落。",
      "第二段落。",
      "第三段落。",
    ]);
  });

  it("keeps a single paragraph intact", () => {
    expect(splitParagraphs("段落がひとつだけの古い形式。")).toEqual([
      "段落がひとつだけの古い形式。",
    ]);
  });

  it("ignores extra blank lines and surrounding whitespace", () => {
    expect(splitParagraphs("  一つ目。 \n\n\n\n 二つ目。\n\n")).toEqual(["一つ目。", "二つ目。"]);
  });

  it("returns an empty array for an empty string", () => {
    expect(splitParagraphs("")).toEqual([]);
  });
});
