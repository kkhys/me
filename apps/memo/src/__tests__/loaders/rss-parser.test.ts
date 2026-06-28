import { describe, expect, test } from "vitest";
import { generateRssEntryId, parseRssItems } from "#/loaders/rss-parser";

const validRss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Test Blog</title>
    <link>https://example.com</link>
    <item>
      <title>First Post</title>
      <link>https://example.com/blog/posts/abc123</link>
      <guid isPermaLink="true">https://example.com/blog/posts/abc123</guid>
      <description>A test post</description>
      <pubDate>Mon, 09 Mar 2026 00:00:00 GMT</pubDate>
      <category>Tech</category>
    </item>
    <item>
      <title>Second Post</title>
      <link>https://example.com/blog/posts/def456</link>
      <guid isPermaLink="true">https://example.com/blog/posts/def456</guid>
      <description>Another test post</description>
      <pubDate>Tue, 10 Mar 2026 00:00:00 GMT</pubDate>
    </item>
  </channel>
</rss>`;

describe("parseRssItems", () => {
  test("should parse valid RSS XML and extract items", () => {
    const items = parseRssItems(validRss);

    expect(items).toHaveLength(2);
    expect(items[0]).toEqual({
      title: "First Post",
      link: "https://example.com/blog/posts/abc123",
      guid: "https://example.com/blog/posts/abc123",
      pubDate: "Mon, 09 Mar 2026 00:00:00 GMT",
    });
    expect(items[1]).toEqual({
      title: "Second Post",
      link: "https://example.com/blog/posts/def456",
      guid: "https://example.com/blog/posts/def456",
      pubDate: "Tue, 10 Mar 2026 00:00:00 GMT",
    });
  });

  test("should return empty array for empty feed", () => {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Empty Blog</title>
  </channel>
</rss>`;

    expect(parseRssItems(xml)).toEqual([]);
  });

  test("should skip items with missing required fields", () => {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <item>
      <title>No Link</title>
      <guid>https://example.com/no-link</guid>
      <pubDate>Mon, 09 Mar 2026 00:00:00 GMT</pubDate>
    </item>
    <item>
      <title>Complete</title>
      <link>https://example.com/complete</link>
      <guid>https://example.com/complete</guid>
      <pubDate>Mon, 09 Mar 2026 00:00:00 GMT</pubDate>
    </item>
  </channel>
</rss>`;

    const items = parseRssItems(xml);
    expect(items).toHaveLength(1);
    expect(items[0]?.title).toBe("Complete");
  });

  test("should return empty array for invalid XML", () => {
    expect(parseRssItems("not xml at all")).toEqual([]);
    expect(parseRssItems("")).toEqual([]);
  });

  test("should not include category in parsed items", () => {
    const items = parseRssItems(validRss);

    for (const item of items) {
      expect(item).not.toHaveProperty("category");
    }
  });

  test("should handle CDATA-wrapped content", () => {
    const xml = `<rss><channel>
      <item>
        <title><![CDATA[Title with <special> chars]]></title>
        <link>https://example.com/post</link>
        <guid>https://example.com/post</guid>
        <pubDate>Mon, 09 Mar 2026 00:00:00 GMT</pubDate>
      </item>
    </channel></rss>`;

    const items = parseRssItems(xml);
    expect(items).toHaveLength(1);
    expect(items[0]?.title).toBe("Title with <special> chars");
  });

  test("should decode HTML entities", () => {
    const xml = `<rss><channel>
      <item>
        <title>Rock &amp; Roll</title>
        <link>https://example.com/post</link>
        <guid>https://example.com/post</guid>
        <pubDate>Mon, 09 Mar 2026 00:00:00 GMT</pubDate>
      </item>
    </channel></rss>`;

    const items = parseRssItems(xml);
    expect(items).toHaveLength(1);
    expect(items[0]?.title).toBe("Rock & Roll");
  });
});

describe("generateRssEntryId", () => {
  test("should extract slug from URL and prefix with rss-", () => {
    expect(generateRssEntryId("https://kkhys.me/blog/posts/b1akmxp")).toBe("rss-b1akmxp");
  });

  test("should handle trailing slash", () => {
    expect(generateRssEntryId("https://kkhys.me/blog/posts/b1akmxp/")).toBe("rss-b1akmxp");
  });

  test("should be idempotent", () => {
    const guid = "https://kkhys.me/blog/posts/abc123";
    expect(generateRssEntryId(guid)).toBe(generateRssEntryId(guid));
  });

  test("should use a custom prefix when provided", () => {
    expect(generateRssEntryId("https://zenn.dev/kkhys/articles/my-article", "zenn")).toBe(
      "zenn-my-article",
    );
  });

  test("should keep prefixes isolated across feeds", () => {
    const guid = "https://example.com/posts/shared-slug";
    expect(generateRssEntryId(guid, "rss")).not.toBe(generateRssEntryId(guid, "zenn"));
  });
});
