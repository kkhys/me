import { describe, expect, it } from "vitest";
import { budouxProcess, getBudouxParser } from "#/lib/budoux";

describe("getBudouxParser", () => {
  it("returns a parser instance", () => {
    const parser = getBudouxParser();
    expect(parser).toBeDefined();
    expect(typeof parser.translateHTMLString).toBe("function");
  });

  it("returns the same instance on subsequent calls (cached)", () => {
    const parser1 = getBudouxParser();
    const parser2 = getBudouxParser();
    expect(parser1).toBe(parser2);
  });
});

describe("budouxProcess", () => {
  it("inserts <wbr> into Japanese text", () => {
    const result = budouxProcess("今日はいい天気ですね");
    expect(result).toContain("<wbr>");
  });

  it("preserves HTML tags", () => {
    const result = budouxProcess("<p>テスト文章</p>");
    expect(result).toContain("<p>");
    expect(result).toContain("</p>");
  });
});
