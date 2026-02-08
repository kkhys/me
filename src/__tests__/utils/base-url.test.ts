import { afterEach, describe, expect, it, vi } from "vitest";

describe("BASE_URL", () => {
  afterEach(() => {
    vi.resetModules();
  });

  it("returns production URL when VERCEL_ENV is production", async () => {
    vi.doMock("astro:env/client", () => ({
      PUBLIC_VERCEL_ENV: "production",
      PUBLIC_VERCEL_PROJECT_PRODUCTION_URL: "kkhys.me",
      PUBLIC_VERCEL_URL: "preview-abc.vercel.app",
    }));

    const { BASE_URL } = await import("#/utils/base-url");
    expect(BASE_URL).toBe("https://kkhys.me");
  });

  it("returns preview URL when VERCEL_ENV is preview", async () => {
    vi.doMock("astro:env/client", () => ({
      PUBLIC_VERCEL_ENV: "preview",
      PUBLIC_VERCEL_PROJECT_PRODUCTION_URL: "kkhys.me",
      PUBLIC_VERCEL_URL: "preview-abc.vercel.app",
    }));

    const { BASE_URL } = await import("#/utils/base-url");
    expect(BASE_URL).toBe("https://preview-abc.vercel.app");
  });

  it("returns localhost when no URL is available", async () => {
    vi.doMock("astro:env/client", () => ({
      PUBLIC_VERCEL_ENV: undefined,
      PUBLIC_VERCEL_PROJECT_PRODUCTION_URL: undefined,
      PUBLIC_VERCEL_URL: undefined,
    }));

    const { BASE_URL } = await import("#/utils/base-url");
    expect(BASE_URL).toBe("http://localhost:4321");
  });
});
