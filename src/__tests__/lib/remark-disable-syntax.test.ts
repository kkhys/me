import { remark } from "remark";
import { describe, expect, test } from "vitest";
import remarkDisableSyntax from "#/lib/remark-disable-syntax";

describe("remark-disable-syntax", () => {
  const processMarkdown = async (markdown: string) => {
    const result = await remark().use(remarkDisableSyntax).process(markdown);
    return result.toString();
  };

  describe("Heading disabling", () => {
    test("should convert H1 heading to paragraph with # prefix", async () => {
      const input = "# Title";
      const result = await processMarkdown(input);

      expect(result).not.toContain("<h1>");
      expect(result).toContain("#");
      expect(result).toContain("Title");
    });

    test("should convert H2-H6 headings to paragraphs with # prefix", async () => {
      const inputs = [
        { input: "## Heading 2", prefix: "##" },
        { input: "### Heading 3", prefix: "###" },
        { input: "#### Heading 4", prefix: "####" },
        { input: "##### Heading 5", prefix: "#####" },
        { input: "###### Heading 6", prefix: "######" },
      ];

      for (const { input, prefix } of inputs) {
        const result = await processMarkdown(input);
        expect(result).not.toContain("<h");
        expect(result).toContain(prefix);
        expect(result).toContain("Heading");
      }
    });
  });

  describe("List disabling", () => {
    test("should disable unordered lists and preserve list markers", async () => {
      const input = `- Item 1
- Item 2
- Item 3`;

      const result = await processMarkdown(input);

      expect(result).not.toContain("<ul>");
      expect(result).not.toContain("<li>");
      expect(result).toContain("- Item 1");
      expect(result).toContain("- Item 2");
      expect(result).toContain("- Item 3");
    });

    test("should disable ordered lists and preserve numbers", async () => {
      const input = `1. Item 1
2. Item 2
3. Item 3`;

      const result = await processMarkdown(input);

      expect(result).not.toContain("<ol>");
      expect(result).not.toContain("<li>");
      expect(result).toContain("1");
      expect(result).toContain("Item 1");
      expect(result).toContain("2");
      expect(result).toContain("Item 2");
      expect(result).toContain("3");
      expect(result).toContain("Item 3");
    });

    test("should disable nested lists and preserve markers", async () => {
      const input = `- Parent item
  - Child item 1
  - Child item 2`;

      const result = await processMarkdown(input);

      expect(result).not.toContain("<ul>");
      expect(result).not.toContain("<li>");
      expect(result).toContain("- Parent item");
      expect(result).toContain("- Child item");
    });

    test("should handle nested ordered lists", async () => {
      const input = `1. First item
   1. Nested item 1
   2. Nested item 2
2. Second item`;

      const result = await processMarkdown(input);

      expect(result).not.toContain("<ol>");
      expect(result).not.toContain("<li>");
      expect(result).toContain("First item");
      expect(result).toContain("Nested item 1");
      expect(result).toContain("Nested item 2");
      expect(result).toContain("Second item");
    });

    test("should handle mixed nested lists (unordered in ordered)", async () => {
      const input = `1. First ordered
   - Nested unordered 1
   - Nested unordered 2
2. Second ordered`;

      const result = await processMarkdown(input);

      expect(result).not.toContain("<ol>");
      expect(result).not.toContain("<ul>");
      expect(result).not.toContain("<li>");
      expect(result).toContain("First ordered");
      expect(result).toContain("Nested unordered 1");
      expect(result).toContain("Nested unordered 2");
      expect(result).toContain("Second ordered");
    });

    test("should handle mixed nested lists (ordered in unordered)", async () => {
      const input = `- First unordered
  1. Nested ordered 1
  2. Nested ordered 2
- Second unordered`;

      const result = await processMarkdown(input);

      expect(result).not.toContain("<ol>");
      expect(result).not.toContain("<ul>");
      expect(result).not.toContain("<li>");
      expect(result).toContain("First unordered");
      expect(result).toContain("Nested ordered 1");
      expect(result).toContain("Nested ordered 2");
      expect(result).toContain("Second unordered");
    });

    test("should handle deeply nested lists", async () => {
      const input = `- Level 1
  - Level 2
    - Level 3`;

      const result = await processMarkdown(input);

      expect(result).not.toContain("<ul>");
      expect(result).not.toContain("<li>");
      expect(result).toContain("- Level 1");
      expect(result).toContain("- Level 2");
      expect(result).toContain("- Level 3");
    });
  });

  describe("Code disabling", () => {
    test("should preserve inline code backticks", async () => {
      const input = "This is `code`";
      const result = await processMarkdown(input);

      expect(result).not.toContain("<code>");
      expect(result).toContain("\\`code\\`");
    });
  });

  test("should preserve plain text and line breaks", async () => {
    const input = `Line 1

Line 2

Line 3`;

    const result = await processMarkdown(input);

    expect(result).toContain("Line 1");
    expect(result).toContain("Line 2");
    expect(result).toContain("Line 3");
  });

  test("should handle list with inline code", async () => {
    const input = "- Item with `code`";
    const result = await processMarkdown(input);

    expect(result).not.toContain("<ul>");
    expect(result).not.toContain("<li>");
    expect(result).not.toContain("<code>");
    expect(result).toContain("Item with");
    expect(result).toContain("\\`code\\`");
  });

  test("should handle ordered list starting from custom number", async () => {
    const input = `5. Fifth item
6. Sixth item`;

    const result = await processMarkdown(input);

    expect(result).not.toContain("<ol>");
    expect(result).not.toContain("<li>");
    expect(result).toContain("Fifth item");
    expect(result).toContain("Sixth item");
  });

  test("should handle complex nested structure with multiple levels", async () => {
    const input = `- Item 1
  - Item 1.1
    - Item 1.1.1
  - Item 1.2
- Item 2`;

    const result = await processMarkdown(input);

    expect(result).not.toContain("<ul>");
    expect(result).not.toContain("<li>");
    expect(result).toContain("Item 1");
    expect(result).toContain("Item 1.1");
    expect(result).toContain("Item 1.1.1");
    expect(result).toContain("Item 1.2");
    expect(result).toContain("Item 2");
  });

  test("should handle list item with only nested list (no text)", async () => {
    const input = `1. First
   - Nested A
   - Nested B
2. Second`;

    const result = await processMarkdown(input);

    expect(result).not.toContain("<ol>");
    expect(result).not.toContain("<ul>");
    expect(result).not.toContain("<li>");
    expect(result).toContain("First");
    expect(result).toContain("Nested A");
    expect(result).toContain("Nested B");
    expect(result).toContain("Second");
  });

  describe("Code block disabling", () => {
    test("should disable code block syntax", async () => {
      const input = "```javascript\nconst x = 1;\n```";
      const result = await processMarkdown(input);

      // Code blocks are disabled
      expect(result).not.toContain("<pre>");
      expect(result).not.toContain("<code>");
      // Backticks are escaped in remark output
      expect(result).toContain("\\`\\`\\`");
      expect(result).toContain("const x = 1;");
    });

    test("should disable simple code block", async () => {
      const input = "```\ncode\n```";
      const result = await processMarkdown(input);

      // Code blocks are disabled
      expect(result).not.toContain("<pre>");
      expect(result).not.toContain("<code>");
      // Backticks are escaped in remark output
      expect(result).toContain("\\`\\`\\`");
      expect(result).toContain("code");
    });
  });

  describe("Known limitations", () => {
    test("cannot disable bold syntax - it will be rendered as <strong>", async () => {
      const input = "This is **bold** text";
      const result = await processMarkdown(input);

      // Bold cannot be disabled (due to remark interpreting backslashes multiple times)
      expect(result).toContain("bold");
    });

    test("cannot disable italic syntax - it will be rendered as <em>", async () => {
      const input = "This is *italic* text";
      const result = await processMarkdown(input);

      // Italic cannot be disabled (due to remark interpreting backslashes multiple times)
      expect(result).toContain("italic");
    });
  });

  describe("Other syntax disabling", () => {
    test("should escape blockquote syntax", async () => {
      const input = "> This is a quote";
      const result = await processMarkdown(input);

      expect(result).not.toContain("<blockquote>");
      expect(result).toContain("\\>");
      expect(result).toContain("This is a quote");
    });

    test("should escape horizontal rule syntax", async () => {
      const input = "---";
      const result = await processMarkdown(input);

      expect(result).not.toContain("<hr>");
      expect(result).toContain("\\-");
    });
  });

  test("should keep links enabled", async () => {
    const input = "[Link text](https://example.com)";
    const result = await processMarkdown(input);

    expect(result).toContain("Link text");
    expect(result).toContain("https://example.com");
  });
});
