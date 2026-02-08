import type { Root } from "mdast";
import { describe, expect, it } from "vitest";
import remarkFootnoteTitle from "#/lib/remark-footnote-title";

const makeTree = (children: Root["children"]): Root => ({
  type: "root",
  children,
});

describe("remarkFootnoteTitle", () => {
  it("sets footnote definition text as title on footnote reference", () => {
    const tree = makeTree([
      {
        type: "footnoteDefinition",
        identifier: "1",
        children: [
          {
            type: "paragraph",
            children: [{ type: "text", value: "Footnote content" }],
          },
        ],
      },
      {
        type: "paragraph",
        children: [{ type: "footnoteReference", identifier: "1" }],
      },
    ]);

    remarkFootnoteTitle()(tree);

    const paragraph = tree.children[1] as any;
    const ref = paragraph.children[0];
    expect(ref.data.hProperties.title).toBe("Footnote content");
  });

  it("handles multiple footnotes correctly", () => {
    const tree = makeTree([
      {
        type: "footnoteDefinition",
        identifier: "1",
        children: [
          {
            type: "paragraph",
            children: [{ type: "text", value: "First footnote" }],
          },
        ],
      },
      {
        type: "footnoteDefinition",
        identifier: "2",
        children: [
          {
            type: "paragraph",
            children: [{ type: "text", value: "Second footnote" }],
          },
        ],
      },
      {
        type: "paragraph",
        children: [
          { type: "footnoteReference", identifier: "1" },
          { type: "footnoteReference", identifier: "2" },
        ],
      },
    ]);

    remarkFootnoteTitle()(tree);

    const paragraph = tree.children[2] as any;
    expect(paragraph.children[0].data.hProperties.title).toBe("First footnote");
    expect(paragraph.children[1].data.hProperties.title).toBe("Second footnote");
  });

  it("concatenates text from inlineCode nodes", () => {
    const tree = makeTree([
      {
        type: "footnoteDefinition",
        identifier: "1",
        children: [
          {
            type: "paragraph",
            children: [
              { type: "text", value: "Using " },
              { type: "inlineCode", value: "console.log" },
              { type: "text", value: " for debugging" },
            ],
          },
        ],
      },
      {
        type: "paragraph",
        children: [{ type: "footnoteReference", identifier: "1" }],
      },
    ]);

    remarkFootnoteTitle()(tree);

    const paragraph = tree.children[1] as any;
    const ref = paragraph.children[0];
    expect(ref.data.hProperties.title).toBe("Using console.log for debugging");
  });

  it("does not set title for references with no matching definition", () => {
    const tree = makeTree([
      {
        type: "paragraph",
        children: [{ type: "footnoteReference", identifier: "999" }],
      },
    ]);

    remarkFootnoteTitle()(tree);

    const paragraph = tree.children[0] as any;
    const ref = paragraph.children[0];
    expect(ref.data).toBeUndefined();
  });
});
