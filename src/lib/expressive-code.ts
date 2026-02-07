import { pluginLineNumbers } from "@expressive-code/plugin-line-numbers";
import type { AstroExpressiveCodeOptions } from "astro-expressive-code";

export const expressiveCodeOptions: AstroExpressiveCodeOptions = {
  themes: ["poimandres", "min-light"],
  plugins: [pluginLineNumbers()],
  defaultProps: {
    showLineNumbers: false,
  },
  useThemedScrollbars: false,
  styleOverrides: {
    borderRadius: "0.25rem",
    borderColor: "var(--code-block-border)",
    borderWidth: "1px",
    codeFontSize: "13px",
    codeBackground: "var(--code-block-background)",
    codePaddingBlock: "1.5rem",
    gutterBorderWidth: "0.5px",
    codePaddingInline: "1rem",
    uiPaddingBlock: "0.5rem",
    codeLineHeight: "1.5rem",
    uiFontSize: "13px",
    uiLineHeight: "1.5rem",
    gutterBorderColor: "var(--code-block-border)",
    gutterForeground: "var(--code-block-gutter)",
    frames: {
      terminalTitlebarBackground: "var(--code-block-header-background)",
      terminalTitlebarBorderBottomColor: "var(--code-block-border)",
      terminalBackground: "var(--code-block-background)",
      editorActiveTabBackground: "var(--code-block-header-background)",
      editorActiveTabIndicatorBottomColor: "var(--code-block-border)",
      editorTabBarBorderBottomColor: "var(--code-block-border)",
      editorTabBarBorderColor: "var(--code-block-border)",
      editorTabBarBackground: "var(--code-block-header-background)",
      editorActiveTabForeground: "var(--code-block-header-foreground)",
      inlineButtonBorder: "var(--code-block-border)",
      inlineButtonBorderOpacity: "1",
      inlineButtonBackground: "var(--code-block-background)",
      frameBoxShadowCssValue:
        "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
    },
  },
};
