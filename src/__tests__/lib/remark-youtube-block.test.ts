import type { Link, Paragraph, Root, Text } from "mdast";
import { describe, expect, it } from "vitest";
import remarkYoutubeBlock from "#/lib/remark-youtube-block";

const makeBareLink = (url: string): Link => ({
  type: "link",
  url,
  children: [{ type: "text", value: url } as Text],
});

const makeParagraph = (children: Paragraph["children"]): Paragraph => ({
  type: "paragraph",
  children,
});

const makeTree = (children: Root["children"]): Root => ({
  type: "root",
  children,
});

describe("remarkYoutubeBlock", () => {
  it("converts youtube.com/watch?v=ID URL", () => {
    const url = "https://www.youtube.com/watch?v=kpz_U8wHpa8";
    const tree = makeTree([makeParagraph([makeBareLink(url)])]);

    remarkYoutubeBlock()(tree);

    const node = tree.children[0] as any;
    expect(node.type).toBe("mdxJsxFlowElement");
    expect(node.name).toBe("youtube-block");
    expect(node.attributes[0].value).toBe("kpz_U8wHpa8");
  });

  it("converts youtu.be/ID URL", () => {
    const url = "https://youtu.be/kpz_U8wHpa8";
    const tree = makeTree([makeParagraph([makeBareLink(url)])]);

    remarkYoutubeBlock()(tree);

    const node = tree.children[0] as any;
    expect(node.type).toBe("mdxJsxFlowElement");
    expect(node.name).toBe("youtube-block");
    expect(node.attributes[0].value).toBe("kpz_U8wHpa8");
  });

  it("converts youtube.com/embed/ID URL", () => {
    const url = "https://www.youtube.com/embed/kpz_U8wHpa8";
    const tree = makeTree([makeParagraph([makeBareLink(url)])]);

    remarkYoutubeBlock()(tree);

    const node = tree.children[0] as any;
    expect(node.type).toBe("mdxJsxFlowElement");
    expect(node.attributes[0].value).toBe("kpz_U8wHpa8");
  });

  it("converts m.youtube.com/watch?v=ID URL", () => {
    const url = "https://m.youtube.com/watch?v=kpz_U8wHpa8";
    const tree = makeTree([makeParagraph([makeBareLink(url)])]);

    remarkYoutubeBlock()(tree);

    const node = tree.children[0] as any;
    expect(node.type).toBe("mdxJsxFlowElement");
    expect(node.attributes[0].value).toBe("kpz_U8wHpa8");
  });

  it("does not convert non-YouTube URLs", () => {
    const url = "https://example.com/watch?v=kpz_U8wHpa8";
    const tree = makeTree([makeParagraph([makeBareLink(url)])]);

    remarkYoutubeBlock()(tree);

    const node = tree.children[0] as Paragraph;
    expect(node.type).toBe("paragraph");
  });

  it("skips IDs that are not 11 characters", () => {
    const url = "https://www.youtube.com/watch?v=short";
    const tree = makeTree([makeParagraph([makeBareLink(url)])]);

    remarkYoutubeBlock()(tree);

    const node = tree.children[0] as Paragraph;
    expect(node.type).toBe("paragraph");
  });

  it("handles URLs with additional parameters", () => {
    const url = "https://www.youtube.com/watch?v=kpz_U8wHpa8&t=120";
    const tree = makeTree([makeParagraph([makeBareLink(url)])]);

    remarkYoutubeBlock()(tree);

    const node = tree.children[0] as any;
    expect(node.type).toBe("mdxJsxFlowElement");
    expect(node.attributes[0].value).toBe("kpz_U8wHpa8");
  });

  it("skips paragraphs with multiple children", () => {
    const url = "https://www.youtube.com/watch?v=kpz_U8wHpa8";
    const tree = makeTree([
      makeParagraph([
        makeBareLink(url),
        { type: "text", value: " extra" } as Text,
      ]),
    ]);

    remarkYoutubeBlock()(tree);

    const node = tree.children[0] as Paragraph;
    expect(node.type).toBe("paragraph");
  });

  it("skips non-bare links", () => {
    const tree = makeTree([
      makeParagraph([
        {
          type: "link",
          url: "https://www.youtube.com/watch?v=kpz_U8wHpa8",
          children: [{ type: "text", value: "Watch this video" } as Text],
        },
      ]),
    ]);

    remarkYoutubeBlock()(tree);

    const node = tree.children[0] as Paragraph;
    expect(node.type).toBe("paragraph");
  });
});
