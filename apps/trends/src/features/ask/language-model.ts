import type { LanguageModelExpectations, LanguageModelStatic } from "#/features/ask/types";

/* The dialog reads and writes Japanese only. Declared on every
   `availability()` and `create()` so Chrome answers for Japanese: on a
   profile without the Japanese assets that is `downloadable` (the gate) or
   `unavailable` (no button), rather than a model that cannot write it. */
export const LANGUAGE_MODEL_EXPECTATIONS: LanguageModelExpectations = {
  expectedInputs: [{ type: "text", languages: ["ja"] }],
  expectedOutputs: [{ type: "text", languages: ["ja"] }],
};

/* Reads the Prompt API off the global scope without an ambient declaration,
   so every caller goes through this one feature check. */
export const getLanguageModel = (scope: object = globalThis): LanguageModelStatic | undefined => {
  const candidate: unknown = Reflect.get(scope, "LanguageModel");
  if (
    (typeof candidate === "function" || typeof candidate === "object") &&
    candidate !== null &&
    typeof Reflect.get(candidate, "availability") === "function" &&
    typeof Reflect.get(candidate, "create") === "function"
  ) {
    return candidate as LanguageModelStatic;
  }
  return undefined;
};
