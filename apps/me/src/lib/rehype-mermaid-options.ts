type ThemeVariables = Record<string, string>;

type MermaidThemeConfig = {
  theme?: string;
  fontFamily?: string;
  themeVariables?: ThemeVariables;
};

export type MermaidOptions = {
  strategy: string;
  mermaidConfig: MermaidThemeConfig;
  dark: MermaidThemeConfig;
};

export const rehypeMermaidOptions: MermaidOptions = {
  strategy: "img-svg",
  mermaidConfig: {
    theme: "base",
    fontFamily: "monospace",
  },
  dark: {
    theme: "base",
    fontFamily: "monospace",
    themeVariables: {
      // Colors mapped to uchu palette hex approximations
      // uchu-gray-5 (80.73%)
      primaryColor: "#b2b2b1",
      secondaryColor: "#545480",
      // uchu-yin-7 (43.87%)
      primaryBorderColor: "#5a5c63",
      // uchu-gray-1 (95.57%)
      primaryTextColor: "#f0f0f1",
      // uchu-gray-1
      secondaryTextColor: "#f0f0f1",
      // uchu-yin-7
      lineColor: "#5a5c63",
      // uchu-gray-1
      textColor: "#f0f0f1",
      // uchu-yin-9 (25.11%)
      mainBkg: "#2b2d33",
      fontSize: "13px",
      // uchu-yin-7
      nodeBorder: "#5a5c63",
      // uchu-yin-9
      clusterBkg: "#2b2d33",
      // uchu-purple-7 (42.77%)
      clusterBorder: "#5a4d6f",
      // uchu-purple-2 (78.68%)
      titleColor: "#c8a8e8",
      edgeLabelBackground: "#544c00",
      // uchu-yin-7
      actorBorder: "#5a5c63",
      // uchu-yin-9
      actorBkg: "#2b2d33",
      // uchu-gray-1
      actorTextColor: "#f0f0f1",
      // uchu-gray-1
      signalColor: "#f0f0f1",
      // uchu-gray-1
      signalTextColor: "#f0f0f1",
      // uchu-yin-9
      labelBoxBkgColor: "#2b2d33",
      // uchu-yin-7
      labelBoxBorderColor: "#5a5c63",
      // uchu-gray-1
      labelTextColor: "#f0f0f1",
      // uchu-gray-1 (fixed typo)
      loopTextColor: "#f0f0f1",
      // uchu-yellow-8 (69.14%)
      noteBorderColor: "#7b731a",
      // uchu-yellow-9 (62.29%)
      noteBkgColor: "#484826",
      // uchu-yellow-5 (89%)
      noteTextColor: "#f4d701",
      // uchu-yin-9
      sequenceNumberColor: "#2b2d33",
      git0: "#808080",
      // uchu-yin-7
      git1: "#5a5c63",
      git2: "#545480",
      git3: "#867d80",
      git4: "#54806f",
      git5: "#75807d",
      // uchu-gray-5
      git6: "#b2b2b1",
      git7: "#80547c",
      // uchu-gray-1
      gitBranchLabel0: "#f0f0f1",
      gitBranchLabel1: "#f0f0f1",
      gitBranchLabel2: "#f0f0f1",
      gitBranchLabel3: "#f0f0f1",
      gitBranchLabel4: "#f0f0f1",
      gitBranchLabel5: "#f0f0f1",
      gitBranchLabel6: "#f0f0f1",
      gitBranchLabel7: "#f0f0f1",
      // uchu-yellow-5
      tagLabelColor: "#f4d701",
      // uchu-yellow-9
      tagLabelBackground: "#484826",
      // uchu-yellow-8
      tagLabelBorder: "#7b731a",
      tagLabelFontSize: "10px",
      // uchu-gray-1
      commitLabelColor: "#f0f0f1",
      commitLabelBackground: "#62626a",
      commitLabelFontSize: "10px",
      // uchu-yin-7
      transitionColor: "#5a5c63",
      // uchu-gray-1
      stateLabelColor: "#f0f0f1",
      // uchu-yin-9
      stateBkg: "#2b2d33",
      // uchu-yin-9
      innerEndBackground: "#2b2d33",
      // uchu-yin-7
      specialStateColor: "#5a5c63",
    },
  },
};
