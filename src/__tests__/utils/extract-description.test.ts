import { describe, expect, it } from "vitest";
import { extractDescription } from "#/utils/extract-description";

describe("extractDescription", () => {
  it("extracts plain text from simple MDX body", () => {
    const body = "これはテスト記事です。\n\n本文の2段落目です。";
    expect(extractDescription(body)).toBe(
      "これはテスト記事です。 本文の2段落目です。",
    );
  });

  it("returns empty string for empty body", () => {
    expect(extractDescription("")).toBe("");
    expect(extractDescription("   ")).toBe("");
  });

  it("returns full text when shorter than maxLength", () => {
    const body = "短いテキスト。";
    expect(extractDescription(body)).toBe("短いテキスト。");
  });

  it("truncates at punctuation boundary in latter half with ellipsis", () => {
    // Build a string longer than 120 chars with punctuation in the latter half
    const body =
      "あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをんアイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホ。" +
      "マミムメモヤユヨラリルレロワヲンABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    const result = extractDescription(body);
    expect(result.endsWith("。")).toBe(true);
  });

  it("truncates at maxLength with ellipsis when no punctuation in latter half", () => {
    const body = "a".repeat(200);
    const result = extractDescription(body);
    expect(result.length).toBe(120);
  });

  it("removes import statements", () => {
    const body =
      'import { Component } from "react";\nimport styles from "./styles.css";\n\n本文テキストです。';
    expect(extractDescription(body)).toBe("本文テキストです。");
  });

  it("removes fenced code blocks", () => {
    const body =
      "コードの前。\n\n```typescript\nconst x = 1;\nconsole.log(x);\n```\n\nコードの後。";
    expect(extractDescription(body)).toBe("コードの前。 コードの後。");
  });

  it("removes alert blockquotes", () => {
    const body =
      "テキスト前。\n\n> [!NOTE]\n> これはノートです。\n> 2行目。\n\nテキスト後。";
    expect(extractDescription(body)).toBe("テキスト前。 テキスト後。");
  });

  it("removes blockquote markers but keeps text", () => {
    const body = "> 引用テキストです。\n\n通常テキスト。";
    expect(extractDescription(body)).toBe("引用テキストです。 通常テキスト。");
  });

  it("removes headings", () => {
    const body = "## 見出し\n\n段落テキスト。\n\n### 小見出し\n\n別の段落。";
    expect(extractDescription(body)).toBe("段落テキスト。 別の段落。");
  });

  it("removes images", () => {
    const body =
      '前のテキスト。\n\n![alt text](./image.jpg "title")\n\n後のテキスト。';
    expect(extractDescription(body)).toBe("前のテキスト。 後のテキスト。");
  });

  it("preserves link text but removes URL", () => {
    const body = "これは[リンクテキスト](https://example.com)を含む文章です。";
    expect(extractDescription(body)).toBe(
      "これはリンクテキストを含む文章です。",
    );
  });

  it("removes inline code", () => {
    const body = "変数 `foo` を使います。";
    expect(extractDescription(body)).toBe("変数 を使います。");
  });

  it("removes bold and italic markers", () => {
    const body = "これは**太字**と*斜体*と***両方***のテスト。";
    expect(extractDescription(body)).toBe("これは太字と斜体と両方のテスト。");
  });

  it("removes horizontal rules", () => {
    const body = "前のテキスト。\n\n---\n\n後のテキスト。";
    expect(extractDescription(body)).toBe("前のテキスト。 後のテキスト。");
  });

  it("removes HTML tags", () => {
    const body = "テキスト<br />改行後<wbr>テキスト。";
    expect(extractDescription(body)).toBe("テキスト改行後テキスト。");
  });

  it("removes footnote references", () => {
    const body = "これは脚注付き[^1]のテキストです。";
    expect(extractDescription(body)).toBe("これは脚注付きのテキストです。");
  });

  it("respects custom maxLength with ellipsis", () => {
    const body = "あ".repeat(50);
    const result = extractDescription(body, 30);
    expect(result.length).toBe(30);
  });

  it("handles complex MDX with multiple elements", () => {
    const body = `import { Component } from "react";

## はじめに

ブログというものは不思議な魅力がある。

初めてブログを書き始めたのは高校2年生の頃だったと思う。

\`\`\`js
console.log("hello");
\`\`\`

![写真](./photo.jpg)

詳しくは[こちら](https://example.com)を参照。`;

    const result = extractDescription(body);
    expect(result).toContain("ブログというものは不思議な魅力がある");
    expect(result).not.toContain("import");
    expect(result).not.toContain("console.log");
    expect(result).not.toContain("![");
    expect(result).not.toContain("https://");
    expect(result).toContain("こちら");
  });
});
