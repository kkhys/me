import { describe, expect, it } from "vitest";

import { plainText } from "#/features/ask/utils/plain";

describe("plainText", () => {
  it("turns bullets into ・ and drops bold, heading and code markers", () => {
    expect(
      plainText(
        "## まとめ\n\n* **セキュリティ:** `PHP` の RCE\n- AI モデル\n  + 入れ子\n1. 番号付き",
      ),
    ).toBe("まとめ\n\n・セキュリティ: PHP の RCE\n・AI モデル\n・入れ子\n1. 番号付き");
  });

  it("leaves prose, hyphens inside text and snake_case alone", () => {
    expect(plainText("2026-10-24 の __init__ は 3 - 1 件")).toBe(
      "2026-10-24 の __init__ は 3 - 1 件",
    );
  });

  it("collapses runs of blank lines and is idempotent", () => {
    const once = plainText("a\n\n\n\nb **c");
    expect(once).toBe("a\n\nb c");
    expect(plainText(once)).toBe(once);
  });
});
