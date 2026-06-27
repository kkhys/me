import type { Node } from "unist";
import { describe, expect, it } from "vitest";
import {
  hasChildren,
  isBareExternalLink,
  isFootnoteDefinition,
  isFootnoteReference,
  isLink,
  isLiteral,
  isNode,
  isParent,
  isText,
} from "#/lib/mdast-util-node-is";

describe("isNode", () => {
  it("returns true for objects with type property", () => {
    expect(isNode({ type: "text" })).toBe(true);
  });

  it("returns false for null", () => {
    expect(isNode(null)).toBe(false);
  });

  it("returns false for undefined", () => {
    expect(isNode(undefined)).toBe(false);
  });

  it("returns false for objects without type", () => {
    expect(isNode({})).toBe(false);
  });

  it("returns false for primitives", () => {
    expect(isNode("string")).toBe(false);
    expect(isNode(42)).toBe(false);
  });
});

describe("isParent", () => {
  it("returns true for objects with children array", () => {
    expect(isParent({ type: "paragraph", children: [] })).toBe(true);
  });

  it("returns false for objects without children", () => {
    expect(isParent({ type: "text" })).toBe(false);
  });

  it("returns false for non-array children", () => {
    expect(isParent({ type: "text", children: "not-array" })).toBe(false);
  });
});

describe("isLiteral", () => {
  it("returns true for objects with value property", () => {
    expect(isLiteral({ type: "text", value: "hello" })).toBe(true);
  });

  it("returns false for objects without value", () => {
    expect(isLiteral({ type: "paragraph" })).toBe(false);
  });
});

describe("isText", () => {
  it("returns true for text nodes", () => {
    expect(isText({ type: "text", value: "hello" })).toBe(true);
  });

  it("returns false for html nodes with value", () => {
    expect(isText({ type: "html", value: "<br>" })).toBe(false);
  });

  it("returns false for nodes without value", () => {
    expect(isText({ type: "text" })).toBe(false);
  });
});

describe("isLink", () => {
  it("returns true for link nodes", () => {
    expect(
      isLink({ type: "link", url: "https://example.com", children: [] }),
    ).toBe(true);
  });

  it("returns false for non-link nodes", () => {
    expect(isLink({ type: "text", value: "hello" })).toBe(false);
  });
});

describe("isBareExternalLink", () => {
  it("returns true for bare external links", () => {
    const node = {
      type: "link",
      url: "https://example.com",
      children: [{ type: "text", value: "https://example.com" }],
    };
    expect(isBareExternalLink(node)).toBe(true);
  });

  it("returns false for internal links", () => {
    const node = {
      type: "link",
      url: "/about",
      children: [{ type: "text", value: "/about" }],
    };
    expect(isBareExternalLink(node)).toBe(false);
  });

  it("returns false when text differs from URL", () => {
    const node = {
      type: "link",
      url: "https://example.com",
      children: [{ type: "text", value: "Click here" }],
    };
    expect(isBareExternalLink(node)).toBe(false);
  });

  it("returns false for non-link nodes", () => {
    expect(isBareExternalLink({ type: "text", value: "hello" })).toBe(false);
  });
});

describe("isFootnoteDefinition", () => {
  it("returns true for footnote definition nodes", () => {
    expect(
      isFootnoteDefinition({
        type: "footnoteDefinition",
        identifier: "1",
        children: [],
      }),
    ).toBe(true);
  });

  it("returns false for other nodes", () => {
    expect(isFootnoteDefinition({ type: "paragraph", children: [] })).toBe(
      false,
    );
  });
});

describe("isFootnoteReference", () => {
  it("returns true for footnote reference nodes", () => {
    expect(
      isFootnoteReference({ type: "footnoteReference", identifier: "1" }),
    ).toBe(true);
  });

  it("returns false for other nodes", () => {
    expect(isFootnoteReference({ type: "text", value: "hello" })).toBe(false);
  });
});

describe("hasChildren", () => {
  it("returns true for nodes with children", () => {
    const node = {
      type: "paragraph",
      children: [{ type: "text", value: "hi" }],
    };
    expect(hasChildren(node as Node)).toBe(true);
  });

  it("returns false for nodes with empty children", () => {
    const node = { type: "paragraph", children: [] };
    expect(hasChildren(node as Node)).toBe(false);
  });

  it("returns false for nodes without children property", () => {
    expect(hasChildren({ type: "text" } as Node)).toBe(false);
  });
});
