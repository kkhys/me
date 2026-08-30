import { describe, expect, it } from "vitest";
import { parseExcerpt } from "../excerpt";

describe("parseExcerpt", () => {
  it("splits Pagefind's <mark> wrappers from the surrounding text", () => {
    expect(parseExcerpt("分散型 <mark>SNS</mark> を構築する")).toEqual([
      { text: "分散型 ", marked: false },
      { text: "SNS", marked: true },
      { text: " を構築する", marked: false },
    ]);
  });

  it("decodes the angle-bracket entities Pagefind emits for HTML in the page text", () => {
    expect(parseExcerpt(`lastLoginIp === '&lt;iframe src="javascript:alert(1)"&gt;'`)).toEqual([
      { text: `lastLoginIp === '<iframe src="javascript:alert(1)">'`, marked: false },
    ]);
  });

  it("keeps unescaped HTML as literal text", () => {
    expect(parseExcerpt(`<img src=x onerror="alert(1)">`)).toEqual([
      { text: `<img src=x onerror="alert(1)">`, marked: false },
    ]);
  });

  it("decodes entities inside marks too", () => {
    expect(parseExcerpt("<mark>&lt;div&gt;</mark>")).toEqual([{ text: "<div>", marked: true }]);
  });

  it("does not treat an escaped <mark> from the page text as a highlight", () => {
    expect(parseExcerpt("&lt;mark&gt;x&lt;/mark&gt;")).toEqual([
      { text: "<mark>x</mark>", marked: false },
    ]);
  });

  it("leaves other entities alone", () => {
    expect(parseExcerpt("a &amp; b")).toEqual([{ text: "a &amp; b", marked: false }]);
  });

  it("handles marks at both ends and back to back", () => {
    expect(parseExcerpt("<mark>a</mark><mark>b</mark>")).toEqual([
      { text: "a", marked: true },
      { text: "b", marked: true },
    ]);
  });

  it("drops empty marks", () => {
    expect(parseExcerpt("x<mark></mark>y")).toEqual([
      { text: "x", marked: false },
      { text: "y", marked: false },
    ]);
  });

  it("returns nothing for an empty excerpt", () => {
    expect(parseExcerpt("")).toEqual([]);
  });
});
