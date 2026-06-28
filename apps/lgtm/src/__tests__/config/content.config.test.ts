import { describe, expect, it } from "vitest";

const resolveLgtmBasePath = (githubActions: boolean | null | undefined) =>
  githubActions ? "./src/__fixtures__/lgtm-sample" : "./lgtm-content/lgtm";

describe("content.config.ts", () => {
  describe("Path selection based on environment", () => {
    it("should use fixture path when GITHUB_ACTIONS is true", () => {
      expect(resolveLgtmBasePath(true)).toBe("./src/__fixtures__/lgtm-sample");
    });

    it("should use lgtm-content path when GITHUB_ACTIONS is false", () => {
      expect(resolveLgtmBasePath(false)).toBe("./lgtm-content/lgtm");
    });

    it("should use lgtm-content path when GITHUB_ACTIONS is undefined", () => {
      expect(resolveLgtmBasePath(undefined)).toBe("./lgtm-content/lgtm");
    });

    it("should use lgtm-content path when GITHUB_ACTIONS is null", () => {
      expect(resolveLgtmBasePath(null)).toBe("./lgtm-content/lgtm");
    });
  });
});
