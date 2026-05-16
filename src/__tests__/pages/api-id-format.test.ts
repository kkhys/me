import type { APIContext } from "astro";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { GET, getStaticPaths } from "#/pages/[id].[format]";

const stillEntry = {
  id: "01kcy2c0k82cmr4sy2ehadrfgk",
  collection: "lgtm",
  data: { image: "01.jpg", animated: false },
};

const animatedEntry = {
  id: "01kcy2c0k82cmr4sy2ehadrfgl",
  collection: "lgtm",
  data: { image: "01.webp", animated: true },
};

vi.mock("astro:content", () => ({
  getCollection: vi.fn(async () => [stillEntry, animatedEntry]),
}));

vi.mock("#/components/lgtm-image", () => ({
  LgtmImage: vi.fn(async () => Buffer.from("mock-image-data")),
  formatForEntry: (entry: { data: { animated: boolean } }) =>
    entry.data.animated ? "webp" : "avif",
}));

describe("[id].[format].ts API Route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getStaticPaths", () => {
    it("should generate one path per entry with format derived from animated flag", async () => {
      const paths = await getStaticPaths();

      expect(paths).toHaveLength(2);
      expect(paths).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            params: { id: stillEntry.id, format: "avif" },
          }),
          expect.objectContaining({
            params: { id: animatedEntry.id, format: "webp" },
          }),
        ]),
      );
    });
  });

  describe("GET handler", () => {
    it("should return avif content type for still entries", async () => {
      const context = {
        params: { id: stillEntry.id, format: "avif" },
        props: { entry: stillEntry },
      } as unknown as APIContext;

      const response = await GET(context);

      expect(response.status).toBe(200);
      expect(response.headers.get("Content-Type")).toBe("image/avif");
    });

    it("should return webp content type for animated entries", async () => {
      const context = {
        params: { id: animatedEntry.id, format: "webp" },
        props: { entry: animatedEntry },
      } as unknown as APIContext;

      const response = await GET(context);

      expect(response.headers.get("Content-Type")).toBe("image/webp");
    });

    it("should set immutable cache control header", async () => {
      const context = {
        params: { id: stillEntry.id, format: "avif" },
        props: { entry: stillEntry },
      } as unknown as APIContext;

      const response = await GET(context);

      const cacheControl = response.headers.get("Cache-Control");
      expect(cacheControl).toContain("public");
      expect(cacheControl).toContain("max-age=31536000");
      expect(cacheControl).toContain("immutable");
    });

    it("should return Uint8Array for valid request", async () => {
      const context = {
        params: { id: stillEntry.id, format: "avif" },
        props: { entry: stillEntry },
      } as unknown as APIContext;

      const response = await GET(context);

      const body = await response.arrayBuffer();
      expect(body.byteLength).toBeGreaterThan(0);
    });
  });
});
