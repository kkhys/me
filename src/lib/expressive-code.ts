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
    borderColor: "var(--c-codeblock-border)",
    borderWidth: "1px",
    codeFontSize: "13px",
    codeBackground: "var(--c-codeblock-bg)",
    codePaddingBlock: "1.5rem",
    gutterBorderWidth: "0.5px",
    codePaddingInline: "1rem",
    uiPaddingBlock: "0.5rem",
    codeLineHeight: "1.5rem",
    uiFontSize: "13px",
    uiLineHeight: "1.5rem",
    gutterBorderColor: "var(--c-codeblock-border)",
    gutterForeground: "var(--c-codeblock-gutter)",
    frames: {
      terminalTitlebarBackground: "var(--c-codeblock-header-bg)",
      terminalTitlebarBorderBottomColor: "var(--c-codeblock-border)",
      terminalBackground: "var(--c-codeblock-bg)",
      editorActiveTabBackground: "var(--c-codeblock-header-bg)",
      editorActiveTabIndicatorBottomColor: "var(--c-codeblock-border)",
      editorTabBarBorderBottomColor: "var(--c-codeblock-border)",
      editorTabBarBorderColor: "var(--c-codeblock-border)",
      editorTabBarBackground: "var(--c-codeblock-header-bg)",
      editorActiveTabForeground: "var(--c-codeblock-header-text)",
      inlineButtonBorder: "var(--c-codeblock-border)",
      inlineButtonBorderOpacity: "1",
      inlineButtonBackground: "var(--c-codeblock-bg)",
      frameBoxShadowCssValue:
        "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
    },
  },
};
