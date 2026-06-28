import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

interface SiteMetadata {
  title: string | undefined;
  description: string | undefined;
  icon?: string | null | undefined;
  image?: unknown;
}

const mockImageResponse = (bytes: Uint8Array) => {
  vi.stubGlobal(
    "fetch",
    vi.fn<typeof fetch>().mockResolvedValue(
      new Response(bytes as unknown as BodyInit, {
        status: 200,
        headers: { "content-type": "image/png" },
      }),
    ),
  );
};

describe("getMetadata", () => {
  let getMetadata: (url: string) => Promise<SiteMetadata>;

  describe("non-production environment", () => {
    beforeEach(async () => {
      vi.resetModules();
      vi.doMock("astro:env/client", () => ({
        NODE_ENV: "development",
      }));
      vi.doMock("fetch-site-metadata", () => ({
        default: vi.fn<typeof import("fetch-site-metadata").default>(),
      }));
      const mod = await import("#/lib/api/metadata");
      getMetadata = mod.getMetadata;
    });

    afterEach(() => {
      vi.resetModules();
    });

    it("returns fallback metadata", async () => {
      const result = await getMetadata("https://example.com");
      expect(result.title).toBe("リンク");
      expect(result.description).toBe("外部リンク");
    });

    it("caches fallback metadata", async () => {
      const result1 = await getMetadata("https://cached-example.com");
      const result2 = await getMetadata("https://cached-example.com");
      expect(result1).toBe(result2);
    });
  });

  describe("CI environment", () => {
    beforeEach(async () => {
      vi.resetModules();
      vi.stubEnv("CI", "true");
      vi.doMock("astro:env/client", () => ({
        NODE_ENV: "production",
      }));
      vi.doMock("fetch-site-metadata", () => ({
        default: vi.fn<typeof import("fetch-site-metadata").default>(),
      }));
      const mod = await import("#/lib/api/metadata");
      getMetadata = mod.getMetadata;
    });

    afterEach(() => {
      vi.unstubAllEnvs();
      vi.resetModules();
    });

    it("returns fallback metadata even in production when CI is set", async () => {
      const result = await getMetadata("https://ci-example.com");
      expect(result.title).toBe("リンク");
      expect(result.description).toBe("外部リンク");
    });
  });

  describe("production environment", () => {
    let mockFetchSiteMetadata: ReturnType<
      typeof vi.fn<(url: string, options?: unknown) => Promise<SiteMetadata>>
    >;

    // PNG magic number, padded so the byte sniffer reads a full chunk.
    const PNG_BYTES = new Uint8Array([
      0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 0, 0, 0, 0, 0,
    ]);

    beforeEach(async () => {
      vi.resetModules();
      vi.stubEnv("CI", "");
      mockImageResponse(PNG_BYTES);
      mockFetchSiteMetadata = vi
        .fn<(url: string, options?: unknown) => Promise<SiteMetadata>>()
        .mockResolvedValue({
          title: "Example",
          description: "Example description",
          image: { src: "https://example.com/og.png", width: "1", height: "1" },
          icon: "https://example.com/favicon.ico",
        });
      vi.doMock("astro:env/client", () => ({
        NODE_ENV: "production",
      }));
      vi.doMock("fetch-site-metadata", () => ({
        default: mockFetchSiteMetadata,
      }));
      const mod = await import("#/lib/api/metadata");
      getMetadata = mod.getMetadata;
    });

    afterEach(() => {
      vi.unstubAllGlobals();
      vi.unstubAllEnvs();
      vi.resetModules();
    });

    it("calls fetchSiteMetadata in production", async () => {
      await getMetadata("https://prod-example.com");
      expect(mockFetchSiteMetadata).toHaveBeenCalledWith(
        "https://prod-example.com",
        expect.objectContaining({
          suppressAdditionalRequest: true,
        }),
      );
    });

    it("returns fetched metadata", async () => {
      const result = await getMetadata("https://prod-example2.com");
      expect(result.title).toBe("Example");
    });

    it("returns fallback on fetch error", async () => {
      mockFetchSiteMetadata.mockRejectedValueOnce(new Error("Network error"));

      const result = await getMetadata("https://error-example.com");
      expect(result.title).toBe("Not Found");
      expect(result.description).toBe("Page not found");
    });

    it("strips SVG og:image so Astro's sharp service won't reject the build", async () => {
      mockFetchSiteMetadata.mockResolvedValueOnce({
        title: "SVG site",
        description: "desc",
        image: { src: "https://example.com/og.svg", width: "1", height: "1" },
        icon: undefined,
      });

      const result = await getMetadata("https://svg-example.com");
      expect(result.image).toBeUndefined();
    });

    it("strips SVG og:image even when the URL has query params", async () => {
      mockFetchSiteMetadata.mockResolvedValueOnce({
        title: "SVG site",
        description: "desc",
        image: {
          src: "https://example.com/og.svg?v=2#frag",
          width: "1",
          height: "1",
        },
        icon: undefined,
      });

      const result = await getMetadata("https://svg-query-example.com");
      expect(result.image).toBeUndefined();
    });

    it("keeps a non-SVG og:image whose bytes are a real raster image", async () => {
      mockFetchSiteMetadata.mockResolvedValueOnce({
        title: "PNG site",
        description: "desc",
        image: { src: "https://example.com/og.png", width: "1", height: "1" },
        icon: undefined,
      });

      const result = await getMetadata("https://png-example.com");
      expect(result.image).toEqual({
        src: "https://example.com/og.png",
        width: "1",
        height: "1",
      });
    });

    it.each([
      {
        label: "JPEG",
        src: "https://example.com/og.jpg",
        bytes: [0xff, 0xd8, 0xff, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      },
      {
        label: "GIF",
        src: "https://example.com/og.gif",
        bytes: [0x47, 0x49, 0x46, 0x38, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      },
      {
        label: "WebP",
        src: "https://example.com/og.webp",
        bytes: [0x52, 0x49, 0x46, 0x46, 0, 0, 0, 0, 0x57, 0x45, 0x42, 0x50, 0, 0, 0, 0],
      },
      {
        label: "AVIF",
        src: "https://example.com/og.avif",
        bytes: [0, 0, 0, 0, 0x66, 0x74, 0x79, 0x70, 0, 0, 0, 0, 0, 0, 0, 0],
      },
    ])("keeps a $label og:image whose bytes are a real raster image", async ({ src, bytes }) => {
      mockImageResponse(new Uint8Array(bytes));
      mockFetchSiteMetadata.mockResolvedValueOnce({
        title: "Raster site",
        description: "desc",
        image: { src, width: "1", height: "1" },
        icon: undefined,
      });

      const result = await getMetadata(src);
      expect(result.image).toEqual({ src, width: "1", height: "1" });
    });

    it("keeps an og:image whose byte stream ends before a full 16-byte chunk", async () => {
      // Only the 8-byte PNG signature, so the reader hits `done` before 16 bytes.
      mockImageResponse(new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
      mockFetchSiteMetadata.mockResolvedValueOnce({
        title: "Short PNG site",
        description: "desc",
        image: { src: "https://example.com/short.png", width: "1", height: "1" },
        icon: undefined,
      });

      const result = await getMetadata("https://short-png-example.com");
      expect(result.image).toEqual({
        src: "https://example.com/short.png",
        width: "1",
        height: "1",
      });
    });

    it("drops an og:image when the image responds with a non-ok status", async () => {
      vi.stubGlobal(
        "fetch",
        vi.fn<typeof fetch>().mockResolvedValue(new Response(null, { status: 404 })),
      );
      mockFetchSiteMetadata.mockResolvedValueOnce({
        title: "Missing image site",
        description: "desc",
        image: { src: "https://example.com/missing.png", width: "1", height: "1" },
        icon: undefined,
      });

      const result = await getMetadata("https://missing-image-example.com");
      expect(result.image).toBeUndefined();
    });

    it("drops an og:image that serves HTML despite an image content-type", async () => {
      // Vercel's docs-og endpoint advertises image/png but returns an HTML
      // bot-protection page to non-browser clients, which crashes sharp.
      mockImageResponse(new TextEncoder().encode("<!DOCTYPE html><html>"));
      mockFetchSiteMetadata.mockResolvedValueOnce({
        title: "Fake image site",
        description: "desc",
        image: {
          src: "https://vercel.com/api/docs-og?title=Deploy%20Hooks",
          width: "1200",
          height: "630",
        },
        icon: undefined,
      });

      const result = await getMetadata("https://fake-image-example.com");
      expect(result.image).toBeUndefined();
    });

    it("drops an og:image when fetching its bytes fails", async () => {
      vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("Network error")));
      mockFetchSiteMetadata.mockResolvedValueOnce({
        title: "Unreachable image site",
        description: "desc",
        image: {
          src: "https://example.com/unreachable.png",
          width: "1",
          height: "1",
        },
        icon: undefined,
      });

      const result = await getMetadata("https://unreachable-image-example.com");
      expect(result.image).toBeUndefined();
    });
  });
});
