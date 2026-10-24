import { describe, expect, it } from "vitest";

import { getLanguageModel } from "#/features/ask/language-model";

describe("getLanguageModel", () => {
  it("returns the Prompt API when the scope defines it", () => {
    const LanguageModel = { availability: () => "available", create: () => ({}) };

    expect(getLanguageModel({ LanguageModel })).toBe(LanguageModel);
  });

  it("accepts the constructor the browser ships", () => {
    const LanguageModel = Object.assign(() => {}, {
      availability: () => Promise.resolve("available" as const),
      create: () => Promise.resolve({}),
    });

    expect(getLanguageModel({ LanguageModel })).toBe(LanguageModel);
  });

  it("returns undefined when the global is missing or incomplete", () => {
    expect(getLanguageModel({})).toBeUndefined();
    expect(
      getLanguageModel({ LanguageModel: { availability: () => "available" } }),
    ).toBeUndefined();
    expect(getLanguageModel({ LanguageModel: "LanguageModel" })).toBeUndefined();
  });
});
