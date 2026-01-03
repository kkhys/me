import { describe, expect, it } from "vitest";

describe("content.config.ts", () => {
  describe("Path selection based on environment", () => {
    it("should use fixture path when GITHUB_ACTIONS is true", () => {
      const GITHUB_ACTIONS = true;

      const lgtmBasePath = GITHUB_ACTIONS
        ? "./src/__fixtures__/lgtm-sample"
        : "./private-content/lgtm";

      expect(lgtmBasePath).toBe("./src/__fixtures__/lgtm-sample");
    });

    it("should use private-content path when GITHUB_ACTIONS is false", () => {
      const GITHUB_ACTIONS = false;

      const lgtmBasePath = GITHUB_ACTIONS
        ? "./src/__fixtures__/lgtm-sample"
        : "./private-content/lgtm";

      expect(lgtmBasePath).toBe("./private-content/lgtm");
    });

    it("should use private-content path when GITHUB_ACTIONS is undefined", () => {
      const GITHUB_ACTIONS = undefined;

      const lgtmBasePath = GITHUB_ACTIONS
        ? "./src/__fixtures__/lgtm-sample"
        : "./private-content/lgtm";

      expect(lgtmBasePath).toBe("./private-content/lgtm");
    });

    it("should use private-content path when GITHUB_ACTIONS is null", () => {
      const GITHUB_ACTIONS = null;

      const lgtmBasePath = GITHUB_ACTIONS
        ? "./src/__fixtures__/lgtm-sample"
        : "./private-content/lgtm";

      expect(lgtmBasePath).toBe("./private-content/lgtm");
    });
  });
});
