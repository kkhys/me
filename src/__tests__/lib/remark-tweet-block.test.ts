import type { Link, Paragraph, Root, Text } from "mdast";
import { describe, expect, it } from "vitest";
import remarkTweetBlock from "#/lib/remark-tweet-block";

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

describe("remarkTweetBlock", () => {
  it("converts twitter.com URL to tweet-block", () => {
    const url = "https://twitter.com/user/status/1234567890123456789";
    const tree = makeTree([makeParagraph([makeBareLink(url)])]);

    remarkTweetBlock()(tree);

    const node = tree.children[0] as any;
    expect(node.type).toBe("mdxJsxFlowElement");
    expect(node.name).toBe("tweet-block");
    expect(node.attributes[0].value).toBe("1234567890123456789");
  });

  it("converts x.com URL to tweet-block", () => {
    const url = "https://x.com/user/status/9876543210987654321";
    const tree = makeTree([makeParagraph([makeBareLink(url)])]);

    remarkTweetBlock()(tree);

    const node = tree.children[0] as any;
    expect(node.type).toBe("mdxJsxFlowElement");
    expect(node.name).toBe("tweet-block");
    expect(node.attributes[0].value).toBe("9876543210987654321");
  });

  it("does not convert non-Twitter URLs", () => {
    const url = "https://example.com/some/page";
    const tree = makeTree([makeParagraph([makeBareLink(url)])]);

    remarkTweetBlock()(tree);

    const node = tree.children[0] as Paragraph;
    expect(node.type).toBe("paragraph");
  });

  it("skips paragraphs with multiple children", () => {
    const url = "https://twitter.com/user/status/123456789";
    const tree = makeTree([
      makeParagraph([
        makeBareLink(url),
        { type: "text", value: " extra text" } as Text,
      ]),
    ]);

    remarkTweetBlock()(tree);

    const node = tree.children[0] as Paragraph;
    expect(node.type).toBe("paragraph");
  });

  it("skips non-bare links (text differs from URL)", () => {
    const tree = makeTree([
      makeParagraph([
        {
          type: "link",
          url: "https://twitter.com/user/status/123456789",
          children: [{ type: "text", value: "Click here" } as Text],
        },
      ]),
    ]);

    remarkTweetBlock()(tree);

    const node = tree.children[0] as Paragraph;
    expect(node.type).toBe("paragraph");
  });

  it("correctly extracts tweet ID", () => {
    const url = "https://twitter.com/elonmusk/status/1580661436132757506";
    const tree = makeTree([makeParagraph([makeBareLink(url)])]);

    remarkTweetBlock()(tree);

    const node = tree.children[0] as any;
    expect(node.attributes[0].value).toBe("1580661436132757506");
  });
});
