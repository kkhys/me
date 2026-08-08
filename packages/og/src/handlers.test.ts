import type { APIContext } from "astro";
import { describe, expect, it } from "vitest";
import { createFaviconRoutes } from "./handlers";

const GRADIENT = "linear-gradient(to bottom, #000000 0%, #ffffff 100%)";

const contextFor = (file: string) => ({ params: { file } }) as unknown as APIContext;

describe("createFaviconRoutes", () => {
  it("emits no routes in production builds", () => {
    const { getStaticPaths } = createFaviconRoutes(GRADIENT, { prod: true });
    expect(getStaticPaths()).toEqual([]);
  });

  it("serves every favicon file in dev", () => {
    const { getStaticPaths } = createFaviconRoutes(GRADIENT, { prod: false });
    const files = getStaticPaths().map(({ params }) => params.file);
    expect(files).toEqual([
      "icon.svg",
      "icon-192.png",
      "icon-512.png",
      "icon-mask.png",
      "apple-touch-icon.png",
    ]);
  });

  it("serves SVG with the right headers", async () => {
    const { GET } = createFaviconRoutes(GRADIENT, { prod: false });
    const response = await GET(contextFor("icon.svg"));

    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toBe("image/svg+xml");
    expect(response.headers.get("Cache-Control")).toBe("public, max-age=31536000, immutable");
    expect(await response.text()).toContain("<svg");
  });

  it("serves PNG bytes", async () => {
    const { GET } = createFaviconRoutes(GRADIENT, { prod: false });
    const response = await GET(contextFor("icon-192.png"));

    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toBe("image/png");
    const bytes = new Uint8Array(await response.arrayBuffer());
    expect(Array.from(bytes.slice(0, 4))).toEqual([0x89, 0x50, 0x4e, 0x47]);
  });

  it("returns 404 for unknown files", async () => {
    const { GET } = createFaviconRoutes(GRADIENT, { prod: false });
    const response = await GET(contextFor("nope.png"));

    expect(response.status).toBe(404);
  });
});
