import { afterEach, describe, expect, it, vi } from "vitest";
import { resolveContentBase, useFixtureData } from "#/config/content-path";

describe("useFixtureData", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("is on only for the exact string true", () => {
    vi.stubEnv("USE_FIXTURE_DATA", "true");
    expect(useFixtureData()).toBe(true);

    vi.stubEnv("USE_FIXTURE_DATA", "1");
    expect(useFixtureData()).toBe(false);

    vi.stubEnv("USE_FIXTURE_DATA", "");
    expect(useFixtureData()).toBe(false);
  });
});

describe("resolveContentBase", () => {
  it("uses the fixture tree when fixtures are requested", () => {
    expect(resolveContentBase(true)).toBe("./src/__fixtures__");
  });

  it("uses the art-content submodule otherwise", () => {
    expect(resolveContentBase(false)).toBe("./art-content");
  });
});
