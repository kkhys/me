import { describe, expect, it } from "vitest";

describe("BASE_URL", () => {
  it("returns site URL from import.meta.env.SITE", async () => {
    const { BASE_URL } = await import("#/utils/base-url");
    expect(BASE_URL).toBe("https://example.com");
  });
});
