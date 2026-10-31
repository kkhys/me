import { describe, expect, it } from "vitest";
import { parseExcerpt, stripLeadingText } from "../excerpt";

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

  it("keeps an unclosed <mark> as literal text", () => {
    expect(parseExcerpt("<mark>a</mark> b <mark>c")).toEqual([
      { text: "a", marked: true },
      { text: " b <mark>c", marked: false },
    ]);
  });

  it("stays linear on many unclosed <mark>s", () => {
    // The lazy-regex version rescanned to the end for each one: seconds at this size.
    const excerpt = "<mark>" + "<mark>a".repeat(50_000);
    expect(parseExcerpt(excerpt)).toEqual([{ text: excerpt, marked: false }]);
  }, 1_000);

  it("returns nothing for an empty excerpt", () => {
    expect(parseExcerpt("")).toEqual([]);
  });
});

describe("stripLeadingText", () => {
  const parts = parseExcerpt;

  it("drops the heading and the separator Pagefind puts after it", () => {
    expect(
      stripLeadingText(parts("<mark>Kimi</mark> Work. Moonshot AI の環境"), "Kimi Work"),
    ).toEqual([{ text: "Moonshot AI の環境", marked: false }]);
  });

  it("keeps a mark that continues past the heading", () => {
    expect(
      stripLeadingText(parts("<mark>Kimi K3</mark> <mark>Kimi</mark> の解説"), "Kimi K3"),
    ).toEqual([
      { text: "Kimi", marked: true },
      { text: " の解説", marked: false },
    ]);
  });

  it("splits a part that runs past the heading", () => {
    expect(stripLeadingText(parts("Report [pdf] Kimi-K3 の構成"), "Report [pdf]")).toEqual([
      { text: "Kimi-K3 の構成", marked: false },
    ]);
  });

  it("leaves an excerpt that starts elsewhere untouched", () => {
    const original = parts("の構成と <mark>学習</mark> 手法");
    expect(stripLeadingText(original, "Report")).toEqual(original);
  });

  it("leaves an excerpt shorter than the heading untouched", () => {
    const original = parts("Kimi");
    expect(stripLeadingText(original, "Kimi Work")).toEqual(original);
  });

  it("is empty when the excerpt is only the heading", () => {
    expect(stripLeadingText(parts("<mark>Kimi</mark> Work."), "Kimi Work")).toEqual([]);
  });

  it("does nothing for an empty heading", () => {
    const original = parts("<mark>Kimi</mark> Work");
    expect(stripLeadingText(original, "")).toEqual(original);
  });
});
