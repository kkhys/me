import { Buffer } from "node:buffer";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// PNG magic number, padded so signature checks read past the header.
const PNG_BYTES = new Uint8Array([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 0, 0, 0, 0, 0,
]);

// ICO header: reserved 0x0000, type 0x0001, one image entry.
const ICO_BYTES = new Uint8Array([0x00, 0x00, 0x01, 0x00, 0x01, 0x00, 0, 0, 0, 0, 0, 0, 0, 0]);

const SVG_TEXT = '<svg xmlns="http://www.w3.org/2000/svg"><rect /></svg>';

// Spelled from the Response constructor rather than DOM's BodyInit: this
// package type-checks against bun's lib, which has no DOM globals.
type ResponseBody = ConstructorParameters<typeof Response>[0];

const mockFetch = (body: ResponseBody, init?: ResponseInit) => {
  const spy = vi.fn<typeof fetch>().mockResolvedValue(new Response(body, init));
  vi.stubGlobal("fetch", spy);
  return spy;
};

describe("getFavicon", () => {
  let getFavicon: typeof import("../favicon").getFavicon;

  beforeEach(async () => {
    // Fresh module per test so the module-level cache doesn't leak between tests.
    vi.resetModules();
    ({ getFavicon } = await import("../favicon"));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns a remote favicon for bytes sharp can decode", async () => {
    mockFetch(PNG_BYTES as unknown as ResponseBody);

    const result = await getFavicon("https://example.com/icon.png");
    expect(result).toEqual({ kind: "remote", src: "https://example.com/icon.png" });
  });

  it("upgrades an http favicon to https before fetching", async () => {
    const spy = mockFetch(PNG_BYTES as unknown as ResponseBody);

    const result = await getFavicon("http://example.com/icon.png");
    expect(result).toEqual({ kind: "remote", src: "https://example.com/icon.png" });
    expect(spy).toHaveBeenCalledWith("https://example.com/icon.png", expect.anything());
  });

  it("inlines an ICO favicon as a data URI", async () => {
    mockFetch(ICO_BYTES as unknown as ResponseBody);

    const result = await getFavicon("https://example.com/favicon.ico");
    expect(result).toEqual({
      kind: "inline",
      src: `data:image/x-icon;base64,${Buffer.from(ICO_BYTES).toString("base64")}`,
    });
  });

  it("inlines an SVG favicon as a data URI", async () => {
    mockFetch(SVG_TEXT);

    const result = await getFavicon("https://example.com/icon.svg");
    expect(result).toEqual({
      kind: "inline",
      src: `data:image/svg+xml;base64,${Buffer.from(SVG_TEXT).toString("base64")}`,
    });
  });

  it("accepts an SVG that opens with an XML prolog", async () => {
    const svg = `<?xml version="1.0" encoding="UTF-8"?>\n${SVG_TEXT}`;
    mockFetch(svg);

    const result = await getFavicon("https://example.com/prolog.svg");
    expect(result.kind).toBe("inline");
  });

  it("rejects XML that is not an SVG", async () => {
    mockFetch('<?xml version="1.0"?><rss version="2.0"></rss>');

    const result = await getFavicon("https://example.com/feed.xml");
    expect(result).toEqual({ kind: "none" });
  });

  it("rejects an HTML page served as a favicon", async () => {
    mockFetch("<!DOCTYPE html><html><body><svg></svg></body></html>");

    const result = await getFavicon("https://example.com/favicon.ico");
    expect(result).toEqual({ kind: "none" });
  });

  it("rejects a favicon that responds with a non-ok status", async () => {
    mockFetch(null, { status: 404 });

    const result = await getFavicon("https://example.com/missing.ico");
    expect(result).toEqual({ kind: "none" });
  });

  it("rejects an empty response body", async () => {
    mockFetch(null, { status: 200 });

    const result = await getFavicon("https://example.com/empty.ico");
    expect(result).toEqual({ kind: "none" });
  });

  it("rejects an ICO too large to inline", async () => {
    const huge = new Uint8Array(50 * 1024 + 1);
    huge.set(ICO_BYTES);
    mockFetch(huge as unknown as ResponseBody);

    const result = await getFavicon("https://example.com/huge.ico");
    expect(result).toEqual({ kind: "none" });
  });

  it("keeps a raster favicon regardless of size", async () => {
    const huge = new Uint8Array(50 * 1024 + 1);
    huge.set(PNG_BYTES);
    mockFetch(huge as unknown as ResponseBody);

    const result = await getFavicon("https://example.com/huge.png");
    expect(result.kind).toBe("remote");
  });

  it("returns none when the fetch itself fails", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("Network error")));

    const result = await getFavicon("https://example.com/unreachable.ico");
    expect(result).toEqual({ kind: "none" });
  });

  it("caches results per icon URL", async () => {
    const spy = mockFetch(PNG_BYTES as unknown as ResponseBody);

    const first = await getFavicon("https://example.com/cached.png");
    const second = await getFavicon("https://example.com/cached.png");
    expect(first).toBe(second);
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
