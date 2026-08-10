import { describe, expect, it } from "vitest";

import { buildSearchText } from "#/utils/search";

describe("buildSearchText", () => {
  it("joins all fields lowercased", () => {
    expect(
      buildSearchText({
        title: "Rust Async Runtime",
        summary: "Tokioの内部構造の解説",
        category: "AI/開発",
        extra: "rust",
      }),
    ).toBe("rust async runtime tokioの内部構造の解説 ai/開発 rust");
  });

  it("collapses whitespace left by empty fields", () => {
    expect(buildSearchText({ title: "Title", summary: "", category: "", extra: "" })).toBe("title");
  });

  it("returns an empty string when every field is empty", () => {
    expect(buildSearchText({ title: "", summary: "", category: "", extra: "" })).toBe("");
  });

  it("includes the discussion summary when present", () => {
    expect(
      buildSearchText({
        title: "Title",
        summary: "",
        category: "",
        extra: "",
        discussion_summary: "コメントでは賛否が分かれた",
      }),
    ).toBe("title コメントでは賛否が分かれた");
  });
});
