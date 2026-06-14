import type { LoaderContext } from "astro/loaders";
import { afterEach, describe, expect, it, vi } from "vitest";
import { parseZennFeed, zennLoader } from "#/lib/loaders/zenn";

const buildItem = ({
  title = "<![CDATA[テスト記事]]>",
  link = "https://zenn.dev/kkhys/articles/test-article",
  pubDate = "Sun, 31 May 2026 04:16:54 GMT",
}: {
  title?: string;
  link?: string;
  pubDate?: string;
} = {}) =>
  `<item><title>${title}</title><description><![CDATA[本文]]></description><link>${link}</link><guid isPermaLink="true">${link}</guid><pubDate>${pubDate}</pubDate></item>`;

const buildFeed = (items: string[]) =>
  `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>feed</title>${items.join(
    "",
  )}</channel></rss>`;

describe("parseZennFeed", () => {
  it("extracts title, url and publishedAt from a CDATA item", () => {
    const items = parseZennFeed(buildFeed([buildItem()]));

    expect(items).toEqual([
      {
        id: "test-article",
        title: "テスト記事",
        url: "https://zenn.dev/kkhys/articles/test-article",
        publishedAt: new Date("Sun, 31 May 2026 04:16:54 GMT"),
      },
    ]);
  });

  it("parses multiple items", () => {
    const feed = buildFeed([
      buildItem({ link: "https://zenn.dev/kkhys/articles/a" }),
      buildItem({ link: "https://zenn.dev/kkhys/articles/b" }),
    ]);

    expect(parseZennFeed(feed).map((item) => item.id)).toEqual(["a", "b"]);
  });

  it("decodes HTML entities in non-CDATA titles", () => {
    const feed = buildFeed([buildItem({ title: "A &amp; B &lt;tag&gt;" })]);

    expect(parseZennFeed(feed)[0]?.title).toBe("A & B <tag>");
  });

  it("skips items missing required fields", () => {
    const incomplete = "<item><title>no link or date</title></item>";

    expect(parseZennFeed(buildFeed([incomplete]))).toEqual([]);
  });

  it("skips items with an unparseable publication date", () => {
    const feed = buildFeed([buildItem({ pubDate: "not a date" })]);

    expect(parseZennFeed(feed)).toEqual([]);
  });

  it("returns an empty array for a feed without items", () => {
    expect(parseZennFeed(buildFeed([]))).toEqual([]);
  });
});

describe("zennLoader", () => {
  const createContext = (metavalues: Record<string, string> = {}) => {
    const metaStore = new Map<string, string>(Object.entries(metavalues));
    return {
      store: {
        clear: vi.fn(),
        set: vi.fn(),
      },
      meta: {
        get: vi.fn((key: string) => metaStore.get(key)),
        set: vi.fn((key: string, value: string) => {
          metaStore.set(key, value);
        }),
        delete: vi.fn((key: string) => {
          metaStore.delete(key);
        }),
        has: vi.fn((key: string) => metaStore.has(key)),
      },
      parseData: vi.fn(({ data }) => Promise.resolve(data)),
      generateDigest: vi.fn(() => "digest"),
      logger: {
        info: vi.fn(),
        warn: vi.fn(),
        error: vi.fn(),
      },
    };
  };

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const okResponse = (
    body: string,
    lastModified: string | null = "Sun, 31 May 2026 05:56:28 GMT",
  ) => ({
    ok: true,
    status: 200,
    text: () => Promise.resolve(body),
    headers: {
      get: (key: string) => (key === "last-modified" ? lastModified : null),
    },
  });

  it("clears the store and sets an entry per feed item on success", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() => Promise.resolve(okResponse(buildFeed([buildItem()])))),
    );

    const context = createContext();
    await zennLoader({ feedUrl: "https://zenn.dev/kkhys/feed" }).load(
      context as unknown as LoaderContext,
    );

    expect(context.store.clear).toHaveBeenCalledOnce();
    expect(context.store.set).toHaveBeenCalledWith({
      id: "test-article",
      data: {
        title: "テスト記事",
        url: "https://zenn.dev/kkhys/articles/test-article",
        publishedAt: new Date("Sun, 31 May 2026 04:16:54 GMT"),
      },
      digest: "digest",
    });
  });

  it("persists the Last-Modified header for conditional requests", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() => Promise.resolve(okResponse(buildFeed([buildItem()])))),
    );

    const context = createContext();
    await zennLoader({ feedUrl: "https://zenn.dev/kkhys/feed" }).load(
      context as unknown as LoaderContext,
    );

    expect(context.meta.set).toHaveBeenCalledWith(
      "last-modified",
      "Sun, 31 May 2026 05:56:28 GMT",
    );
  });

  it("sends If-Modified-Since and reuses cached entries on a 304 response", async () => {
    const fetchMock = vi.fn(() => Promise.resolve({ status: 304, ok: false }));
    vi.stubGlobal("fetch", fetchMock);

    const context = createContext({
      "last-modified": "Sun, 31 May 2026 05:56:28 GMT",
    });
    await zennLoader({ feedUrl: "https://zenn.dev/kkhys/feed" }).load(
      context as unknown as LoaderContext,
    );

    expect(fetchMock).toHaveBeenCalledWith("https://zenn.dev/kkhys/feed", {
      headers: { "If-Modified-Since": "Sun, 31 May 2026 05:56:28 GMT" },
    });
    expect(context.store.clear).not.toHaveBeenCalled();
    expect(context.store.set).not.toHaveBeenCalled();
  });

  it("logs an error and keeps existing entries when the fetch fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() =>
        Promise.resolve({
          ok: false,
          status: 503,
          statusText: "Service Unavailable",
        }),
      ),
    );

    const context = createContext();
    await zennLoader({ feedUrl: "https://zenn.dev/kkhys/feed" }).load(
      context as unknown as LoaderContext,
    );

    expect(context.logger.error).toHaveBeenCalledOnce();
    expect(context.store.clear).not.toHaveBeenCalled();
    expect(context.store.set).not.toHaveBeenCalled();
  });

  it("logs a warning and keeps existing entries when the feed is empty", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() => Promise.resolve(okResponse(buildFeed([])))),
    );

    const context = createContext();
    await zennLoader({ feedUrl: "https://zenn.dev/kkhys/feed" }).load(
      context as unknown as LoaderContext,
    );

    expect(context.logger.warn).toHaveBeenCalledOnce();
    expect(context.store.clear).not.toHaveBeenCalled();
  });
});
