import { remark } from "remark";
import { describe, expect, test } from "vitest";
import remarkTruncateLinkText, {
  truncateLinkText,
} from "#/lib/remark-truncate-link-text";

describe("remarkTruncateLinkText", () => {
  const processContent = async (content: string): Promise<string> => {
    const result = await remark().use(remarkTruncateLinkText).process(content);
    return result.toString().trim();
  };

  describe("URL truncation patterns", () => {
    test("should truncate URL with single path segment", async () => {
      const content =
        "[https://developer.hatenastaff.com/entry/engineer-seminar-35](https://developer.hatenastaff.com/entry/engineer-seminar-35)";
      const result = await processContent(content);
      expect(result).toBe(
        "[developer.hatenastaff.com/entry…](https://developer.hatenastaff.com/entry/engineer-seminar-35)",
      );
    });

    test("should truncate URL with multiple path segments", async () => {
      const content =
        "[https://ja.wikipedia.org/wiki/%E5%85%A8%E5%9B%BD%E6%96%B0%E5%B9%B9%E7%B7%9A%E9%89%84%E9%81%93%E6%95%B4%E5%82%99%E6%B3%95](https://ja.wikipedia.org/wiki/%E5%85%A8%E5%9B%BD%E6%96%B0%E5%B9%B9%E7%B7%9A%E9%89%84%E9%81%93%E6%95%B4%E5%82%99%E6%B3%95)";
      const result = await processContent(content);
      expect(result).toBe(
        "[ja.wikipedia.org/wiki…](https://ja.wikipedia.org/wiki/%E5%85%A8%E5%9B%BD%E6%96%B0%E5%B9%B9%E7%B7%9A%E9%89%84%E9%81%93%E6%95%B4%E5%82%99%E6%B3%95)",
      );
    });

    test("should keep domain only when no path exists", async () => {
      const content = "[https://example.com](https://example.com)";
      const result = await processContent(content);
      expect(result).toBe("[example.com](https://example.com)");
    });

    test("should keep domain only when path is root slash", async () => {
      const content = "[https://example.com/](https://example.com/)";
      const result = await processContent(content);
      expect(result).toBe("[example.com](https://example.com/)");
    });

    test("should handle HTTP protocol", async () => {
      const content =
        "[http://example.com/path/to/page](http://example.com/path/to/page)";
      const result = await processContent(content);
      expect(result).toBe(
        "[example.com/path…](http://example.com/path/to/page)",
      );
    });

    test("should handle HTTPS protocol", async () => {
      const content =
        "[https://example.com/path/to/page](https://example.com/path/to/page)";
      const result = await processContent(content);
      expect(result).toBe(
        "[example.com/path…](https://example.com/path/to/page)",
      );
    });
  });

  describe("custom link text", () => {
    test("should not truncate when custom text is provided", async () => {
      const content = "[Custom Link Text](https://example.com/path/to/page)";
      const result = await processContent(content);
      expect(result).toBe(
        "[Custom Link Text](https://example.com/path/to/page)",
      );
    });

    test("should not truncate when text is not a URL", async () => {
      const content = "[Click here](https://example.com/path)";
      const result = await processContent(content);
      expect(result).toBe("[Click here](https://example.com/path)");
    });

    test("should truncate only when text matches URL pattern", async () => {
      const content = "Check out [this page](https://example.com/path)";
      const result = await processContent(content);
      expect(result).toBe("Check out [this page](https://example.com/path)");
    });

    test("should not truncate when link has mixed content (not pure text)", async () => {
      const content =
        "[**https://example.com/path**](https://example.com/path)";
      const result = await processContent(content);
      expect(result).toBe(
        "[**https://example.com/path**](https://example.com/path)",
      );
    });

    test("should not truncate when link contains code", async () => {
      const content = "[`https://example.com/path`](https://example.com/path)";
      const result = await processContent(content);
      expect(result).toBe(
        "[`https://example.com/path`](https://example.com/path)",
      );
    });
  });

  describe("internal and relative links", () => {
    test("should ignore relative links", async () => {
      const content = "[/path/to/page](/path/to/page)";
      const result = await processContent(content);
      expect(result).toBe("[/path/to/page](/path/to/page)");
    });

    test("should ignore hash links", async () => {
      const content = "[#section](#section)";
      const result = await processContent(content);
      expect(result).toBe("[#section](#section)");
    });

    test("should ignore relative path links", async () => {
      const content = "[./relative/path](./relative/path)";
      const result = await processContent(content);
      expect(result).toBe("[./relative/path](./relative/path)");
    });
  });

  describe("edge cases", () => {
    test("should handle URL with query parameters", async () => {
      const content =
        "[https://example.com/search?q=test](https://example.com/search?q=test)";
      const result = await processContent(content);
      expect(result).toBe(
        "[example.com/search…](https://example.com/search?q=test)",
      );
    });

    test("should handle URL with hash fragment", async () => {
      const content =
        "[https://example.com/page#section](https://example.com/page#section)";
      const result = await processContent(content);
      expect(result).toBe(
        "[example.com/page…](https://example.com/page#section)",
      );
    });

    test("should handle URL with query and hash", async () => {
      const content =
        "[https://example.com/page?foo=bar#section](https://example.com/page?foo=bar#section)";
      const result = await processContent(content);
      expect(result).toBe(
        "[example.com/page…](https://example.com/page?foo=bar#section)",
      );
    });

    test("should handle subdomain", async () => {
      const content =
        "[https://blog.example.com/post/123](https://blog.example.com/post/123)";
      const result = await processContent(content);
      expect(result).toBe(
        "[blog.example.com/post…](https://blog.example.com/post/123)",
      );
    });

    test("should handle multiple links in one document", async () => {
      const content = `
[https://first.com/path](https://first.com/path)
[https://second.com/another/path](https://second.com/another/path)
      `.trim();
      const result = await processContent(content);
      expect(result).toContain("[first.com/path…](https://first.com/path)");
      expect(result).toContain(
        "[second.com/another…](https://second.com/another/path)",
      );
    });

    test("should handle mixed external and internal links", async () => {
      const content = `
[/internal](/internal)
[https://external.com/path](https://external.com/path)
      `.trim();
      const result = await processContent(content);
      expect(result).toContain("[/internal](/internal)");
      expect(result).toContain(
        "[external.com/path…](https://external.com/path)",
      );
    });

    test("should handle uppercase protocol", async () => {
      const content = "[HTTPS://EXAMPLE.COM/PATH](HTTPS://EXAMPLE.COM/PATH)";
      const result = await processContent(content);
      // URL() normalizes hostname to lowercase
      expect(result).toBe("[example.com/PATH…](HTTPS://EXAMPLE.COM/PATH)");
    });

    test("should handle mixed case protocol", async () => {
      const content = "[HtTpS://example.com/path](HtTpS://example.com/path)";
      const result = await processContent(content);
      expect(result).toBe("[example.com/path…](HtTpS://example.com/path)");
    });
  });

  describe("no links", () => {
    test("should handle plain text without links", async () => {
      const content = "This is just plain text.";
      const result = await processContent(content);
      expect(result).toBe("This is just plain text.");
    });

    test("should handle empty content", async () => {
      const content = "";
      const result = await processContent(content);
      expect(result).toBe("");
    });
  });

  describe("content with text and links", () => {
    test("should handle link with surrounding text", async () => {
      const content =
        "Check out this article: [https://example.com/article/123](https://example.com/article/123) for more info.";
      const result = await processContent(content);
      expect(result).toBe(
        "Check out this article: [example.com/article…](https://example.com/article/123) for more info.",
      );
    });

    test("should handle multiple paragraphs with links", async () => {
      const content = `
First paragraph with [https://first.com/path](https://first.com/path).

Second paragraph with [https://second.com/path](https://second.com/path).
      `.trim();
      const result = await processContent(content);
      expect(result).toContain("[first.com/path…](https://first.com/path)");
      expect(result).toContain("[second.com/path…](https://second.com/path)");
    });
  });

  describe("real world examples", () => {
    test("should handle Hatena blog URL", async () => {
      const content =
        "[https://developer.hatenastaff.com/entry/engineer-seminar-35](https://developer.hatenastaff.com/entry/engineer-seminar-35)";
      const result = await processContent(content);
      expect(result).toBe(
        "[developer.hatenastaff.com/entry…](https://developer.hatenastaff.com/entry/engineer-seminar-35)",
      );
    });

    test("should handle Wikipedia URL with encoded characters", async () => {
      const content =
        "[https://ja.wikipedia.org/wiki/%E5%85%A8%E5%9B%BD%E6%96%B0%E5%B9%B9%E7%B7%9A%E9%89%84%E9%81%93%E6%95%B4%E5%82%99%E6%B3%95](https://ja.wikipedia.org/wiki/%E5%85%A8%E5%9B%BD%E6%96%B0%E5%B9%B9%E7%B7%9A%E9%89%84%E9%81%93%E6%95%B4%E5%82%99%E6%B3%95)";
      const result = await processContent(content);
      expect(result).toBe(
        "[ja.wikipedia.org/wiki…](https://ja.wikipedia.org/wiki/%E5%85%A8%E5%9B%BD%E6%96%B0%E5%B9%B9%E7%B7%9A%E9%89%84%E9%81%93%E6%95%B4%E5%82%99%E6%B3%95)",
      );
    });

    test("should handle GitHub repository URL", async () => {
      const content =
        "[https://github.com/user/repo/issues/123](https://github.com/user/repo/issues/123)";
      const result = await processContent(content);
      expect(result).toBe(
        "[github.com/user…](https://github.com/user/repo/issues/123)",
      );
    });

    test("should handle documentation URL", async () => {
      const content =
        "[https://docs.example.com/guide/getting-started](https://docs.example.com/guide/getting-started)";
      const result = await processContent(content);
      expect(result).toBe(
        "[docs.example.com/guide…](https://docs.example.com/guide/getting-started)",
      );
    });
  });
});

describe("truncateLinkText (unit tests)", () => {
  describe("valid URLs", () => {
    test("should truncate URL with path", () => {
      const result = truncateLinkText("https://example.com/path/to/page");
      expect(result).toBe("example.com/path…");
    });

    test("should return hostname only when no path", () => {
      const result = truncateLinkText("https://example.com");
      expect(result).toBe("example.com");
    });

    test("should return hostname only when path is root slash", () => {
      const result = truncateLinkText("https://example.com/");
      expect(result).toBe("example.com");
    });
  });

  describe("invalid URLs", () => {
    test("should return original string for invalid URL", () => {
      const invalidUrl = "not-a-valid-url";
      const result = truncateLinkText(invalidUrl);
      expect(result).toBe(invalidUrl);
    });

    test("should return original string for malformed URL", () => {
      const invalidUrl = "://invalid";
      const result = truncateLinkText(invalidUrl);
      expect(result).toBe(invalidUrl);
    });

    test("should return original string for empty string", () => {
      const result = truncateLinkText("");
      expect(result).toBe("");
    });
  });
});
