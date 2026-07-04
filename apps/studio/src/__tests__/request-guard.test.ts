import { describe, expect, it } from "vitest";
import { isAllowedRequest } from "../request-guard";

const ALLOWED = new Set(["127.0.0.1:5757", "localhost:5757"]);

const request = (headers: Record<string, string>): Request =>
  new Request("http://127.0.0.1:5757/api/memos", { headers });

describe("isAllowedRequest", () => {
  it("allows a same-origin request without an Origin header", () => {
    expect(isAllowedRequest(request({ host: "127.0.0.1:5757" }), ALLOWED)).toBe(true);
    expect(isAllowedRequest(request({ host: "localhost:5757" }), ALLOWED)).toBe(true);
  });

  it("allows a request with a localhost Origin", () => {
    expect(
      isAllowedRequest(
        request({ host: "127.0.0.1:5757", origin: "http://localhost:5757" }),
        ALLOWED,
      ),
    ).toBe(true);
  });

  it("rejects a missing or empty Host header", () => {
    // Host is added at send time, so a bare Request has none
    expect(isAllowedRequest(new Request("http://127.0.0.1:5757/"), ALLOWED)).toBe(false);
    expect(isAllowedRequest(request({ host: "" }), ALLOWED)).toBe(false);
  });

  it("rejects a DNS-rebound Host header", () => {
    expect(isAllowedRequest(request({ host: "evil.example:5757" }), ALLOWED)).toBe(false);
  });

  it("rejects a cross-origin request from another site", () => {
    expect(
      isAllowedRequest(
        request({ host: "127.0.0.1:5757", origin: "https://evil.example" }),
        ALLOWED,
      ),
    ).toBe(false);
  });

  it("rejects an allowed hostname on a different port", () => {
    expect(isAllowedRequest(request({ host: "127.0.0.1:8080" }), ALLOWED)).toBe(false);
    expect(
      isAllowedRequest(
        request({ host: "127.0.0.1:5757", origin: "http://127.0.0.1:8080" }),
        ALLOWED,
      ),
    ).toBe(false);
  });

  it("rejects a malformed Origin header", () => {
    expect(isAllowedRequest(request({ host: "127.0.0.1:5757", origin: "null" }), ALLOWED)).toBe(
      false,
    );
  });
});
