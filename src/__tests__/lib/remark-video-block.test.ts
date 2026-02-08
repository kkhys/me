import type { Root } from "mdast";
import { describe, expect, it } from "vitest";
import remarkVideoBlock from "#/lib/remark-video-block";

const makeVideoElement = (attributes: any[] = [], children: any[] = []) => ({
  type: "mdxJsxFlowElement" as const,
  name: "video",
  attributes,
  children,
});

const makeTree = (children: Root["children"]): Root => ({
  type: "root",
  children,
});

describe("remarkVideoBlock", () => {
  it("converts <video> to <video-block>", () => {
    const tree = makeTree([makeVideoElement()]);

    remarkVideoBlock()(tree);

    const node = tree.children[0] as any;
    expect(node.type).toBe("mdxJsxFlowElement");
    expect(node.name).toBe("video-block");
  });

  it("preserves attributes", () => {
    const attrs = [
      { type: "mdxJsxAttribute", name: "src", value: "/video.mp4" },
      { type: "mdxJsxAttribute", name: "poster", value: "/poster.jpg" },
    ];
    const tree = makeTree([makeVideoElement(attrs)]);

    remarkVideoBlock()(tree);

    const node = tree.children[0] as any;
    expect(node.attributes).toEqual(attrs);
  });

  it("throws error when video has children", () => {
    const tree = makeTree([
      makeVideoElement([], [{ type: "text", value: "child" }]),
    ]);

    expect(() => remarkVideoBlock()(tree)).toThrow(
      "video-block は子要素を持つことができません",
    );
  });

  it("handles video with undefined attributes", () => {
    const tree = makeTree([
      {
        type: "mdxJsxFlowElement" as const,
        name: "video",
        attributes: undefined as any,
        children: [],
      },
    ]);

    remarkVideoBlock()(tree);

    const node = tree.children[0] as any;
    expect(node.name).toBe("video-block");
    expect(node.attributes).toEqual([]);
  });

  it("skips non-video mdxJsxFlowElement", () => {
    const tree = makeTree([
      {
        type: "mdxJsxFlowElement" as const,
        name: "img",
        attributes: [],
        children: [],
      },
    ]);

    remarkVideoBlock()(tree);

    const node = tree.children[0] as any;
    expect(node.name).toBe("img");
  });
});
