import { remark } from "remark";
import { describe, expect, test } from "vitest";
import { createVFile } from "#/__fixtures__/vfile-helpers";
import remarkExtractLink from "#/lib/remark-extract-link";

describe("remarkExtractLink", () => {
  const processContent = async (content: string) => {
    const result = await remark().use(remarkExtractLink).process(content);
    return result.data.astro?.frontmatter?.firstExternalLink;
  };

  describe("external links", () => {
    test("should extract first HTTP link", async () => {
      const content = "This is [a link](http://example.com) and more text.";
      const link = await processContent(content);
      expect(link).toBe("http://example.com");
    });

    test("should extract first HTTPS link", async () => {
      const content = "This is [a link](https://example.com) and more text.";
      const link = await processContent(content);
      expect(link).toBe("https://example.com");
    });

    test("should extract only the first external link when multiple links exist", async () => {
      const content =
        "First [link](https://first.com) and second [link](https://second.com)";
      const link = await processContent(content);
      expect(link).toBe("https://first.com");
    });

    test("should handle HTTP protocol in uppercase", async () => {
      const content = "Link with [uppercase](HTTP://EXAMPLE.COM)";
      const link = await processContent(content);
      expect(link).toBe("HTTP://EXAMPLE.COM");
    });

    test("should handle HTTPS protocol in uppercase", async () => {
      const content = "Link with [uppercase](HTTPS://EXAMPLE.COM)";
      const link = await processContent(content);
      expect(link).toBe("HTTPS://EXAMPLE.COM");
    });

    test("should handle mixed case protocol", async () => {
      const content = "Link with [mixed case](HtTpS://example.com)";
      const link = await processContent(content);
      expect(link).toBe("HtTpS://example.com");
    });
  });

  describe("internal and relative links", () => {
    test("should ignore relative links", async () => {
      const content = "This is [a relative link](/path/to/page) and text.";
      const link = await processContent(content);
      expect(link).toBeNull();
    });

    test("should ignore hash links", async () => {
      const content = "This is [an anchor](#section) and text.";
      const link = await processContent(content);
      expect(link).toBeNull();
    });

    test("should ignore relative path links", async () => {
      const content = "This is [a path](./relative/path) and text.";
      const link = await processContent(content);
      expect(link).toBeNull();
    });

    test("should extract external link when mixed with internal links", async () => {
      const content =
        "Internal [link](/page) and external [link](https://example.com)";
      const link = await processContent(content);
      expect(link).toBe("https://example.com");
    });
  });

  describe("no links", () => {
    test("should return null when no links exist", async () => {
      const content = "This is just plain text without any links.";
      const link = await processContent(content);
      expect(link).toBeNull();
    });

    test("should return null for empty content", async () => {
      const content = "";
      const link = await processContent(content);
      expect(link).toBeNull();
    });
  });

  describe("edge cases", () => {
    test("should handle content with multiple paragraphs", async () => {
      const content = `
First paragraph with [internal link](/page).

Second paragraph with [external link](https://example.com).
      `.trim();
      const link = await processContent(content);
      expect(link).toBe("https://example.com");
    });

    test("should handle links in lists", async () => {
      const content = `
- Item 1 with [internal link](/page)
- Item 2 with [external link](https://example.com)
      `.trim();
      const link = await processContent(content);
      expect(link).toBe("https://example.com");
    });

    test("should handle links with query parameters", async () => {
      const content = "Link with [params](https://example.com?foo=bar&baz=qux)";
      const link = await processContent(content);
      expect(link).toBe("https://example.com?foo=bar&baz=qux");
    });

    test("should handle links with hash fragments", async () => {
      const content = "Link with [fragment](https://example.com#section)";
      const link = await processContent(content);
      expect(link).toBe("https://example.com#section");
    });
  });

  describe("VFile data structure", () => {
    test("should create astro.frontmatter structure when it doesn't exist", async () => {
      const processor = remark().use(remarkExtractLink);
      const result = await processor.process("[link](https://example.com)");

      expect(result.data.astro).toBeDefined();
      expect(result.data.astro?.frontmatter).toBeDefined();
      expect(result.data.astro?.frontmatter?.firstExternalLink).toBe(
        "https://example.com",
      );
    });

    test("should handle VFile with existing astro but no frontmatter", async () => {
      const processor = remark().use(remarkExtractLink);
      const file = createVFile("[link](https://example.com)", {
        astro: {},
      });

      const result = await processor.process(file);

      expect(result.data.astro?.frontmatter).toBeDefined();
      expect(result.data.astro?.frontmatter?.firstExternalLink).toBe(
        "https://example.com",
      );
    });

    test("should handle VFile with existing astro and frontmatter", async () => {
      const processor = remark().use(remarkExtractLink);
      const file = createVFile("[link](https://example.com)", {
        astro: {
          frontmatter: {
            existingField: "value",
          },
        },
      });

      const result = await processor.process(file);

      expect(result.data.astro?.frontmatter?.existingField).toBe("value");
      expect(result.data.astro?.frontmatter?.firstExternalLink).toBe(
        "https://example.com",
      );
    });
  });
});
