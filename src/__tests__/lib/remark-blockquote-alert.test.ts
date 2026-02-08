import type { Blockquote, Paragraph, Root, Text } from "mdast";
import { describe, expect, it } from "vitest";
import remarkBlockQuoteAlert from "#/lib/remark-blockquote-alert";

const makeAlertBlockquote = (
  alertText: string,
  bodyText?: string,
): Blockquote => {
  const textValue = bodyText ? `${alertText}\n${bodyText}` : alertText;
  return {
    type: "blockquote",
    children: [
      {
        type: "paragraph",
        children: [{ type: "text", value: textValue } as Text],
      } as Paragraph,
    ],
  };
};

const makeTree = (children: Root["children"]): Root => ({
  type: "root",
  children,
});

describe("remarkBlockQuoteAlert", () => {
  it("converts [!NOTE] to alert with type note", () => {
    const tree = makeTree([makeAlertBlockquote("[!NOTE]", "Note content")]);

    remarkBlockQuoteAlert()(tree);

    const node = tree.children[0] as any;
    expect(node.data.hName).toBe("div");
    expect(node.data.hProperties.dataAlertType).toBe("note");
  });

  it("converts [!TIP] to alert with type tip", () => {
    const tree = makeTree([makeAlertBlockquote("[!TIP]", "Tip content")]);

    remarkBlockQuoteAlert()(tree);

    const node = tree.children[0] as any;
    expect(node.data.hProperties.dataAlertType).toBe("tip");
  });

  it("converts [!IMPORTANT] to alert with type important", () => {
    const tree = makeTree([makeAlertBlockquote("[!IMPORTANT]", "Important content")]);

    remarkBlockQuoteAlert()(tree);

    const node = tree.children[0] as any;
    expect(node.data.hProperties.dataAlertType).toBe("important");
  });

  it("converts [!WARNING] to alert with type warning", () => {
    const tree = makeTree([makeAlertBlockquote("[!WARNING]", "Warning content")]);

    remarkBlockQuoteAlert()(tree);

    const node = tree.children[0] as any;
    expect(node.data.hProperties.dataAlertType).toBe("warning");
  });

  it("converts [!CAUTION] to alert with type caution", () => {
    const tree = makeTree([makeAlertBlockquote("[!CAUTION]", "Caution content")]);

    remarkBlockQuoteAlert()(tree);

    const node = tree.children[0] as any;
    expect(node.data.hProperties.dataAlertType).toBe("caution");
  });

  it("handles case-insensitive alert types", () => {
    const tree = makeTree([makeAlertBlockquote("[!note]", "Content")]);

    remarkBlockQuoteAlert()(tree);

    const node = tree.children[0] as any;
    expect(node.data.hProperties.dataAlertType).toBe("note");
  });

  it("handles alert text with newline content", () => {
    const tree = makeTree([makeAlertBlockquote("[!NOTE]\nThis is the body")]);

    remarkBlockQuoteAlert()(tree);

    const node = tree.children[0] as any;
    expect(node.data.hProperties.dataAlertType).toBe("note");
    const paragraph = node.children[0] as Paragraph;
    const text = paragraph.children[0] as Text;
    expect(text.value).toBe("This is the body");
  });

  it("handles alert with break element after type", () => {
    const blockquote: Blockquote = {
      type: "blockquote",
      children: [
        {
          type: "paragraph",
          children: [
            { type: "text", value: "[!NOTE]" } as Text,
            { type: "break" } as any,
            { type: "text", value: "Content after break" } as Text,
          ],
        } as Paragraph,
      ],
    };
    const tree = makeTree([blockquote]);

    remarkBlockQuoteAlert()(tree);

    const node = tree.children[0] as any;
    expect(node.data.hProperties.dataAlertType).toBe("note");
  });

  it("does not convert normal blockquotes", () => {
    const tree = makeTree([
      {
        type: "blockquote",
        children: [
          {
            type: "paragraph",
            children: [{ type: "text", value: "Just a regular quote" } as Text],
          } as Paragraph,
        ],
      } as Blockquote,
    ]);

    remarkBlockQuoteAlert()(tree);

    const node = tree.children[0] as Blockquote;
    expect(node.data).toBeUndefined();
  });

  it("does not convert when first child is not text", () => {
    const tree = makeTree([
      {
        type: "blockquote",
        children: [
          {
            type: "paragraph",
            children: [
              { type: "emphasis", children: [{ type: "text", value: "[!NOTE]" }] } as any,
            ],
          } as Paragraph,
        ],
      } as Blockquote,
    ]);

    remarkBlockQuoteAlert()(tree);

    const node = tree.children[0] as Blockquote;
    expect(node.data).toBeUndefined();
  });

  it("only processes the first paragraph in a blockquote", () => {
    const tree = makeTree([
      {
        type: "blockquote",
        children: [
          {
            type: "paragraph",
            children: [{ type: "text", value: "[!NOTE]\nFirst paragraph" } as Text],
          } as Paragraph,
          {
            type: "paragraph",
            children: [{ type: "text", value: "[!WARNING]\nSecond paragraph" } as Text],
          } as Paragraph,
        ],
      } as Blockquote,
    ]);

    remarkBlockQuoteAlert()(tree);

    const node = tree.children[0] as any;
    expect(node.data.hProperties.dataAlertType).toBe("note");
  });
});
