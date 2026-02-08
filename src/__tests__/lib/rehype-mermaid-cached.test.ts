import { createHash } from "node:crypto";
import path from "node:path";
import type { Element, Root } from "hast";
import { describe, expect, it, vi } from "vitest";

const lightSvgPath = path.resolve(__dirname, "../../__fixtures__/mermaid-light.svg");
const darkSvgPath = path.resolve(__dirname, "../../__fixtures__/mermaid-dark.svg");

const lightSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="100"><rect fill="#fff" width="200" height="100"/></svg>';
const darkSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="100"><rect fill="#000" width="200" height="100"/></svg>';

const getMermaidHash = (source: string) =>
  createHash("sha256").update(source).digest("hex").slice(0, 16);

const makeMermaidTree = (source: string): Root => ({
  type: "root",
  children: [
    {
      type: "element",
      tagName: "pre",
      properties: {},
      children: [
        {
          type: "element",
          tagName: "code",
          properties: { className: ["language-mermaid"] },
          children: [{ type: "text", value: source }],
        },
      ],
    } as Element,
  ],
});

vi.mock("node:fs", () => ({
  readFileSync: vi.fn((filePath: string) => {
    if (filePath.endsWith("-light.svg")) return lightSvg;
    if (filePath.endsWith("-dark.svg")) return darkSvg;
    throw new Error(`File not found: ${filePath}`);
  }),
}));

describe("rehypeMermaidCached", () => {
  it("converts language-mermaid code block to <picture> element", async () => {
    const rehypeMermaidCached = (await import("#/lib/rehype-mermaid-cached")).default;
    const source = "graph TD; A-->B;";
    const tree = makeMermaidTree(source);

    rehypeMermaidCached()(tree);

    const picture = tree.children[0] as Element;
    expect(picture.tagName).toBe("picture");
  });

  it("creates <source> with dark media query and <img> with light src", async () => {
    const rehypeMermaidCached = (await import("#/lib/rehype-mermaid-cached")).default;
    const source = "graph TD; A-->B;";
    const tree = makeMermaidTree(source);

    rehypeMermaidCached()(tree);

    const picture = tree.children[0] as Element;
    const sourceEl = picture.children[0] as Element;
    const imgEl = picture.children[1] as Element;

    expect(sourceEl.tagName).toBe("source");
    expect(sourceEl.properties.media).toBe("(prefers-color-scheme: dark)");
    expect(imgEl.tagName).toBe("img");
  });

  it("extracts width and height from SVG", async () => {
    const rehypeMermaidCached = (await import("#/lib/rehype-mermaid-cached")).default;
    const source = "graph TD; A-->B;";
    const tree = makeMermaidTree(source);

    rehypeMermaidCached()(tree);

    const picture = tree.children[0] as Element;
    const imgEl = picture.children[1] as Element;

    expect(imgEl.properties.width).toBe("200");
    expect(imgEl.properties.height).toBe("100");
  });

  it("throws error when cache files are not found", async () => {
    const { readFileSync } = await import("node:fs");
    const mockedReadFileSync = vi.mocked(readFileSync);
    mockedReadFileSync.mockImplementationOnce(() => {
      throw new Error("ENOENT");
    });

    const rehypeMermaidCached = (await import("#/lib/rehype-mermaid-cached")).default;
    const source = "graph TD; X-->Y;";
    const tree = makeMermaidTree(source);

    expect(() => rehypeMermaidCached()(tree)).toThrow("Mermaid cache not found");
  });

  it("skips non-mermaid code blocks", async () => {
    const rehypeMermaidCached = (await import("#/lib/rehype-mermaid-cached")).default;
    const tree: Root = {
      type: "root",
      children: [
        {
          type: "element",
          tagName: "pre",
          properties: {},
          children: [
            {
              type: "element",
              tagName: "code",
              properties: { className: ["language-javascript"] },
              children: [{ type: "text", value: "console.log('hi')" }],
            },
          ],
        } as Element,
      ],
    };

    rehypeMermaidCached()(tree);

    const pre = tree.children[0] as Element;
    expect(pre.tagName).toBe("pre");
  });

  it("skips empty source", async () => {
    const rehypeMermaidCached = (await import("#/lib/rehype-mermaid-cached")).default;
    const tree = makeMermaidTree("   ");

    rehypeMermaidCached()(tree);

    const pre = tree.children[0] as Element;
    expect(pre.tagName).toBe("pre");
  });

  it("handles SVGs without width/height attributes", async () => {
    const { readFileSync } = await import("node:fs");
    const mockedReadFileSync = vi.mocked(readFileSync);
    mockedReadFileSync.mockImplementation((filePath: any) => {
      // Return SVG without width/height
      return '<svg xmlns="http://www.w3.org/2000/svg"><rect/></svg>';
    });

    vi.resetModules();
    const rehypeMermaidCached = (await import("#/lib/rehype-mermaid-cached")).default;
    const source = "graph TD; NoDims;";
    const tree = makeMermaidTree(source);

    rehypeMermaidCached()(tree);

    const picture = tree.children[0] as Element;
    const imgEl = picture.children[1] as Element;
    expect(imgEl.properties.width).toBeUndefined();
    expect(imgEl.properties.height).toBeUndefined();
  });

  it("skips <pre> without <code> child", async () => {
    const rehypeMermaidCached = (await import("#/lib/rehype-mermaid-cached")).default;
    const tree: Root = {
      type: "root",
      children: [
        {
          type: "element",
          tagName: "pre",
          properties: {},
          children: [{ type: "text", value: "just text" }],
        } as Element,
      ],
    };

    rehypeMermaidCached()(tree);

    const pre = tree.children[0] as Element;
    expect(pre.tagName).toBe("pre");
  });
});
