import { fromHtml } from "hast-util-from-html";
import { toHtml } from "hast-util-to-html";
import { describe, expect, it } from "vitest";
import rehypeBudoux from "#/lib/rehype-budoux";

const process = (html: string, options?: { targetTagNames?: string[] }) => {
  const tree = fromHtml(html, { fragment: true });
  rehypeBudoux(options ?? {})(tree);
  return toHtml(tree);
};

describe("rehypeBudoux", () => {
  it("inserts <wbr> in <p> tags with Japanese text", () => {
    const result = process("<p>今日はいい天気ですね</p>");
    expect(result).toContain("<wbr>");
  });

  it("processes <h1> tags", () => {
    const result = process("<h1>今日はいい天気ですね</h1>");
    expect(result).toContain("<wbr>");
  });

  it("processes <h2> tags", () => {
    const result = process("<h2>今日はいい天気ですね</h2>");
    expect(result).toContain("<wbr>");
  });

  it("processes <h3> tags", () => {
    const result = process("<h3>今日はいい天気ですね</h3>");
    expect(result).toContain("<wbr>");
  });

  it("processes <li> tags", () => {
    const result = process("<li>今日はいい天気ですね</li>");
    expect(result).toContain("<wbr>");
  });

  it("does not modify non-target tags like <div>", () => {
    const html = "<div>変更されないテキスト</div>";
    const result = process(html);
    expect(result).not.toContain("<wbr>");
  });

  it("respects custom targetTagNames option", () => {
    const result = process("<div>今日はいい天気ですね</div>", {
      targetTagNames: ["div"],
    });
    expect(result).toContain("<wbr>");
  });

  it("processes nested elements", () => {
    const result = process(
      "<p><strong>太字の日本語テキスト</strong>を含む段落</p>",
    );
    expect(result).toContain("<wbr>");
  });
});
