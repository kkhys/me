import type { Heading, Image, Paragraph, Root, Text } from "mdast";
import { describe, expect, it } from "vitest";
import remarkUnwrapImages from "#/lib/remark-unwrap-images";

const makeImage = (url: string, alt = ""): Image => ({
  type: "image",
  url,
  alt,
});

const makeParagraph = (children: Paragraph["children"]): Paragraph => ({
  type: "paragraph",
  children,
});

const makeTree = (children: Root["children"]): Root => ({
  type: "root",
  children,
});

describe("remarkUnwrapImages", () => {
  it("unwraps an image that is the sole child of a paragraph", () => {
    const tree = makeTree([makeParagraph([makeImage("./photo.jpg")])]);

    remarkUnwrapImages()(tree);

    const node = tree.children[0] as Image;
    expect(node.type).toBe("image");
    expect(node.url).toBe("./photo.jpg");
  });

  it("skips paragraphs with multiple children", () => {
    const tree = makeTree([
      makeParagraph([
        makeImage("./photo.jpg"),
        { type: "text", value: " caption" } as Text,
      ]),
    ]);

    remarkUnwrapImages()(tree);

    const node = tree.children[0] as Paragraph;
    expect(node.type).toBe("paragraph");
  });

  it("skips paragraphs with non-image children", () => {
    const tree = makeTree([
      makeParagraph([{ type: "text", value: "hello" } as Text]),
    ]);

    remarkUnwrapImages()(tree);

    const node = tree.children[0] as Paragraph;
    expect(node.type).toBe("paragraph");
  });

  it("handles multiple images in separate paragraphs", () => {
    const tree = makeTree([
      makeParagraph([makeImage("./a.jpg")]),
      makeParagraph([makeImage("./b.jpg")]),
    ]);

    remarkUnwrapImages()(tree);

    expect(tree.children).toHaveLength(2);
    expect((tree.children[0] as Image).type).toBe("image");
    expect((tree.children[0] as Image).url).toBe("./a.jpg");
    expect((tree.children[1] as Image).type).toBe("image");
    expect((tree.children[1] as Image).url).toBe("./b.jpg");
  });

  it("preserves non-paragraph siblings", () => {
    const tree = makeTree([
      { type: "heading", depth: 1, children: [] },
      makeParagraph([makeImage("./photo.jpg")]),
      makeParagraph([{ type: "text", value: "text" } as Text]),
    ]);

    remarkUnwrapImages()(tree);

    expect(tree.children).toHaveLength(3);
    const first = tree.children[0] as Heading;
    const second = tree.children[1] as Image;
    const third = tree.children[2] as Paragraph;
    expect(first.type).toBe("heading");
    expect(second.type).toBe("image");
    expect(third.type).toBe("paragraph");
  });
});
