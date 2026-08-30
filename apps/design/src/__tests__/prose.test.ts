import { describe, expect, it } from "vitest";
import { enhanceProse } from "#/utils/prose";

const JA = "あらゆる現実をすべて自分のほうへねじ曲げたのだ";

describe("enhanceProse", () => {
  it("inserts phrase breaks into prose blocks", () => {
    const { html } = enhanceProse(`<p>${JA}</p>`);
    expect(html).toContain("<wbr>");
    expect(html).toContain('class="budoux"');
    expect(html.replaceAll("<wbr>", "")).toContain(JA);
  });

  it("leaves highlighted code untouched", () => {
    const snippet = `<pre class="astro-code"><code><span>検索ボタンを置く</span></code></pre>`;
    const { html } = enhanceProse(`<p>${JA}</p>${snippet}`);
    expect(html).toContain(snippet);
  });

  it("skips subtrees that opt out", () => {
    const { html } = enhanceProse(
      `<div data-budoux="off"><p>${JA}</p></div><p class="on">${JA}</p>`,
    );
    const [off, on] = html.split('<p class="on');
    expect(off).not.toContain("<wbr>");
    expect(on).toContain("<wbr>");
  });

  it("does not re-process blocks already handled by the Budoux component", () => {
    const processed = `<p class="budoux">あらゆる<wbr>現実を</p>`;
    const { html } = enhanceProse(processed);
    expect(html).toBe(processed);
  });

  it("keeps the count badge out of the Pagefind anchor title", () => {
    const { html } = enhanceProse(`<h2 id="motion">Motion <small>9 rules</small></h2>`);
    expect(html).toContain('<small data-pagefind-ignore="">9 rules</small>');
  });

  it("collects h2 headings with ids as sections, in order", () => {
    const { sections } = enhanceProse(
      `<h1>Colors</h1><h2 id="semantic">セマンティックカラー <small>14 tokens</small></h2><h2>無視</h2><h2 id="palette">uchu パレット</h2>`,
    );
    expect(sections).toEqual([
      { id: "semantic", label: "セマンティックカラー" },
      { id: "palette", label: "uchu パレット" },
    ]);
  });

  it("returns the html unchanged when there is nothing to do", () => {
    expect(enhanceProse("")).toEqual({ html: "", sections: [] });
  });
});
