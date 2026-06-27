import type { Root } from "mdast";
import type { Plugin, Processor } from "unified";

/**
 * Plugin to escape Markdown syntax with backslash escaping
 *
 * @description
 * Adds backslashes before Markdown syntax symbols before parsing.
 * Since remark doesn't recognize them as syntax, they are displayed as plain text.
 *
 * **Syntax that can be escaped**:
 * - Headings (#, ##, ...)
 * - Lists (-, *, +, 1.)
 * - Inline code (`)
 * - Code blocks (```)
 * - Blockquotes (>)
 * - Horizontal rules (---, ***, ___)
 *
 * **Syntax that cannot be escaped** (due to remark interpreting backslashes multiple times):
 * - Bold (**, __)
 * - Italic (*, _)
 * - Strikethrough (~~) - Not supported by default remark
 *
 * **Links**: Not escaped (intentionally left enabled)
 *
 * @returns unified transformation plugin
 * @example
 * ```typescript
 * import { remark } from 'remark';
 * import remarkEscapeSyntax from './remark-escape-syntax';
 *
 * const result = await remark()
 *   .use(remarkEscapeSyntax)
 *   .process('# Heading');
 * // Output: \# Heading
 * ```
 */
const remarkEscapeSyntax: Plugin<[], Root> = function (this: Processor) {
  const parser = this.parser;
  const originalParse = parser?.prototype?.parse || parser;

  this.parser = (doc: string) => {
    let text = doc;

    // 1. Protect code blocks (temporarily save before inline code processing)
    const codeBlocks: string[] = [];
    text = text.replace(/```[\s\S]*?```/gm, (match) => {
      codeBlocks.push(match);
      return `___CODEBLOCK_${codeBlocks.length - 1}___`;
    });

    // 2. Escape inline code
    text = text.replace(/`([^`]+)`/g, "\\`$1\\`");

    // 3. Restore code blocks (convert ``` to \```)
    text = text.replace(/___CODEBLOCK_(\d+)___/g, (_, index) => {
      // biome-ignore lint/style/noNonNullAssertion: Index always exists as it references saved codeBlocks
      return codeBlocks[parseInt(index, 10)]!.replace(/```/g, "\\```");
    });

    // 4. Escape headings
    text = text.replace(/^(#{1,6})\s/gm, "\\$1 ");

    // 5. Escape blockquotes
    text = text.replace(/^(\s*)>\s/gm, "$1\\> ");

    // 6. Escape horizontal rules (before list markers)
    text = text.replace(/^(\s*)([-*_])\2{2,}\s*$/gm, "$1\\$2$2$2");

    // 7. Escape unordered lists
    text = text.replace(/^(\s*)([*\-+])\s/gm, "$1\\$2 ");

    // 8. Escape ordered lists
    text = text.replace(/^(\s*)(\d+)\.\s/gm, "$1$2\\. ");

    // Note: Bold (**, __), italic (*, _), and strikethrough (~~) cannot be escaped
    // because remark interprets backslashes multiple times

    // Parse with escaped text
    return originalParse.call(this, text);
  };
};

export default remarkEscapeSyntax;
