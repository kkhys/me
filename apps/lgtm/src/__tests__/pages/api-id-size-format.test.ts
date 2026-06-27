import type { APIContext } from "astro";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { GET, getStaticPaths } from "#/pages/[id]-[size].[format]";

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

describe("[id]-[size].[format].ts API Route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getStaticPaths", () => {
    it("should generate one path per entry per size with format derived from animated flag", async () => {
      const paths = await getStaticPaths();

      // 2 entries × 3 sizes
      expect(paths).toHaveLength(6);

      for (const size of ["400", "1000", "1200"] as const) {
        expect(paths).toContainEqual(
          expect.objectContaining({
            params: { id: stillEntry.id, size, format: "avif" },
          }),
        );
        expect(paths).toContainEqual(
          expect.objectContaining({
            params: { id: animatedEntry.id, size, format: "webp" },
          }),
        );
      }
    });
  });

  describe("GET handler", () => {
    it("should return avif for still entries", async () => {
      const context = {
        params: { id: stillEntry.id, size: "400", format: "avif" },
        props: { entry: stillEntry, size: "400" },
      } as unknown as APIContext;

      const response = await GET(context);

      expect(response.status).toBe(200);
      expect(response.headers.get("Content-Type")).toBe("image/avif");
    });

    it("should return webp for animated entries", async () => {
      const context = {
        params: { id: animatedEntry.id, size: "1000", format: "webp" },
        props: { entry: animatedEntry, size: "1000" },
      } as unknown as APIContext;

      const response = await GET(context);

      expect(response.headers.get("Content-Type")).toBe("image/webp");
    });

    it("should set immutable cache control header", async () => {
      const context = {
        params: { id: stillEntry.id, size: "400", format: "avif" },
        props: { entry: stillEntry, size: "400" },
      } as unknown as APIContext;

      const response = await GET(context);

      const cacheControl = response.headers.get("Cache-Control");
      expect(cacheControl).toContain("public");
      expect(cacheControl).toContain("max-age=31536000");
      expect(cacheControl).toContain("immutable");
    });

    it("should call LgtmImage with the parsed width", async () => {
      const { LgtmImage } = await import("#/components/lgtm-image");

      const context = {
        params: { id: stillEntry.id, size: "1200", format: "avif" },
        props: { entry: stillEntry, size: "1200" },
      } as unknown as APIContext;

      await GET(context);

      expect(LgtmImage).toHaveBeenCalledWith(
        expect.objectContaining({ id: stillEntry.id }),
        1200,
      );
    });
  });
});
