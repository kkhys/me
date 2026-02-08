import type { Link, Paragraph, Root, Text } from "mdast";
import { describe, expect, it } from "vitest";
import remarkLinkCard from "#/lib/remark-link-card";

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

describe("remarkLinkCard", () => {
  it("converts bare external link to link card", () => {
    const url = "https://example.com";
    const tree = makeTree([makeParagraph([makeBareLink(url)])]);

    remarkLinkCard()(tree);

    const node = tree.children[0] as Link;
    expect(node.type).toBe("link");
    expect(node.data?.hProperties).toEqual({ dataLinkCard: true });
  });

  it("extracts link from paragraph (unwraps)", () => {
    const url = "https://example.com/page";
    const tree = makeTree([makeParagraph([makeBareLink(url)])]);

    remarkLinkCard()(tree);

    const node = tree.children[0] as Link;
    expect(node.type).toBe("link");
    expect(node.url).toBe(url);
  });

  it("skips internal links (non-http)", () => {
    const tree = makeTree([
      makeParagraph([
        {
          type: "link",
          url: "/about",
          children: [{ type: "text", value: "/about" } as Text],
        },
      ]),
    ]);

    remarkLinkCard()(tree);

    const node = tree.children[0] as Paragraph;
    expect(node.type).toBe("paragraph");
  });

  it("skips links where text differs from URL", () => {
    const tree = makeTree([
      makeParagraph([
        {
          type: "link",
          url: "https://example.com",
          children: [{ type: "text", value: "Click here" } as Text],
        },
      ]),
    ]);

    remarkLinkCard()(tree);

    const node = tree.children[0] as Paragraph;
    expect(node.type).toBe("paragraph");
  });

  it("skips paragraphs with multiple children", () => {
    const url = "https://example.com";
    const tree = makeTree([
      makeParagraph([
        makeBareLink(url),
        { type: "text", value: " extra" } as Text,
      ]),
    ]);

    remarkLinkCard()(tree);

    const node = tree.children[0] as Paragraph;
    expect(node.type).toBe("paragraph");
  });

  it("preserves existing data properties", () => {
    const link = makeBareLink("https://example.com");
    link.data = { existing: true };
    const tree = makeTree([makeParagraph([link])]);

    remarkLinkCard()(tree);

    const node = tree.children[0] as Link;
    expect(node.data?.existing).toBe(true);
    expect(node.data?.hProperties).toEqual({ dataLinkCard: true });
  });
});
