import type { Element, Root, Text } from "hast";
import { describe, expect, it } from "vitest";
import rehypeSlugWithCustomId from "#/lib/rehype-slug-with-custom-id";
import { generateBech32m } from "#/utils/hash";

const makeHeading = (level: number, text: string): Element => ({
  type: "element",
  tagName: `h${level}`,
  properties: {},
  children: [{ type: "text", value: text } as Text],
});

const makeTree = (children: Element[]): Root => ({
  type: "root",
  children,
});

describe("rehypeSlugWithCustomId", () => {
  it.each([1, 2, 3, 4, 5, 6])("adds ID to h%i heading", (level) => {
    const text = `Heading level ${level}`;
    const tree = makeTree([makeHeading(level, text)]);

    rehypeSlugWithCustomId()(tree);

    const heading = tree.children[0] as Element;
    expect(heading.properties.id).toBe(generateBech32m(text, "h"));
  });

  it("generates ID matching generateBech32m output", () => {
    const text = "Test Heading";
    const tree = makeTree([makeHeading(2, text)]);

    rehypeSlugWithCustomId()(tree);

    const heading = tree.children[0] as Element;
    expect(heading.properties.id).toBe(generateBech32m(text, "h"));
  });

  it("concatenates only text nodes (ignores non-text children)", () => {
    const tree = makeTree([
      {
        type: "element",
        tagName: "h2",
        properties: {},
        children: [
          { type: "text", value: "Hello " } as Text,
          {
            type: "element",
            tagName: "code",
            properties: {},
            children: [{ type: "text", value: "world" } as Text],
          } as Element,
          { type: "text", value: " end" } as Text,
        ],
      },
    ]);

    rehypeSlugWithCustomId()(tree);

    const heading = tree.children[0] as Element;
    // Only direct text children are concatenated: "Hello " + " end"
    expect(heading.properties.id).toBe(generateBech32m("Hello  end", "h"));
  });

  it("preserves existing properties", () => {
    const tree = makeTree([
      {
        type: "element",
        tagName: "h2",
        properties: { className: ["title"] },
        children: [{ type: "text", value: "Test" } as Text],
      },
    ]);

    rehypeSlugWithCustomId()(tree);

    const heading = tree.children[0] as Element;
    expect(heading.properties.className).toEqual(["title"]);
    expect(heading.properties.id).toBeDefined();
  });

  it("handles heading without properties (falsy properties)", () => {
    const tree = makeTree([
      {
        type: "element",
        tagName: "h2",
        // @ts-expect-error -- testing falsy properties
        properties: undefined,
        children: [{ type: "text", value: "No Props" } as Text],
      },
    ]);

    rehypeSlugWithCustomId()(tree);

    const heading = tree.children[0] as Element;
    expect(heading.properties.id).toBe(generateBech32m("No Props", "h"));
  });
});
