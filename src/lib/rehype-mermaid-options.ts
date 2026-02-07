import type { RehypeMermaidOptions } from "rehype-mermaid";

export const rehypeMermaidOptions: RehypeMermaidOptions = {
  strategy: "img-svg",
  mermaidConfig: {
    theme: "base",
    fontFamily: "monospace",
    themeVariables: {
      // TODO: Add more theme variables
    },
  },
  dark: {
    theme: "base",
    fontFamily: "monospace",
    themeVariables: {
      // Colors mapped to uchu palette hex approximations
      primaryColor: "#b2b2b1", // uchu-gray-5 (80.73%)
      secondaryColor: "#545480",
      primaryBorderColor: "#5a5c63", // uchu-yin-7 (43.87%)
      primaryTextColor: "#f0f0f1", // uchu-gray-1 (95.57%)
      secondaryTextColor: "#f0f0f1", // uchu-gray-1
      lineColor: "#5a5c63", // uchu-yin-7
      textColor: "#f0f0f1", // uchu-gray-1
      mainBkg: "#2b2d33", // uchu-yin-9 (25.11%)
      fontSize: "13px",
      nodeBorder: "#5a5c63", // uchu-yin-7
      clusterBkg: "#2b2d33", // uchu-yin-9
      clusterBorder: "#5a4d6f", // uchu-purple-7 (42.77%)
      titleColor: "#c8a8e8", // uchu-purple-2 (78.68%)
      edgeLabelBackground: "#544c00",
      actorBorder: "#5a5c63", // uchu-yin-7
      actorBkg: "#2b2d33", // uchu-yin-9
      actorTextColor: "#f0f0f1", // uchu-gray-1
      signalColor: "#f0f0f1", // uchu-gray-1
      signalTextColor: "#f0f0f1", // uchu-gray-1
      labelBoxBkgColor: "#2b2d33", // uchu-yin-9
      labelBoxBorderColor: "#5a5c63", // uchu-yin-7
      labelTextColor: "#f0f0f1", // uchu-gray-1
      loopTextColor: "#f0f0f1", // uchu-gray-1 (fixed typo)
      noteBorderColor: "#7b731a", // uchu-yellow-8 (69.14%)
      noteBkgColor: "#484826", // uchu-yellow-9 (62.29%)
      noteTextColor: "#f4d701", // uchu-yellow-5 (89%)
      sequenceNumberColor: "#2b2d33", // uchu-yin-9
      git0: "#808080",
      git1: "#5a5c63", // uchu-yin-7
      git2: "#545480",
      git3: "#867d80",
      git4: "#54806f",
      git5: "#75807d",
      git6: "#b2b2b1", // uchu-gray-5
      git7: "#80547c",
      gitBranchLabel0: "#f0f0f1", // uchu-gray-1
      gitBranchLabel1: "#f0f0f1",
      gitBranchLabel2: "#f0f0f1",
      gitBranchLabel3: "#f0f0f1",
      gitBranchLabel4: "#f0f0f1",
      gitBranchLabel5: "#f0f0f1",
      gitBranchLabel6: "#f0f0f1",
      gitBranchLabel7: "#f0f0f1",
      tagLabelColor: "#f4d701", // uchu-yellow-5
      tagLabelBackground: "#484826", // uchu-yellow-9
      tagLabelBorder: "#7b731a", // uchu-yellow-8
      tagLabelFontSize: "10px",
      commitLabelColor: "#f0f0f1", // uchu-gray-1
      commitLabelBackground: "#62626a",
      commitLabelFontSize: "10px",
      transitionColor: "#5a5c63", // uchu-yin-7
      stateLabelColor: "#f0f0f1", // uchu-gray-1
      stateBkg: "#2b2d33", // uchu-yin-9
      innerEndBackground: "#2b2d33", // uchu-yin-9
      specialStateColor: "#5a5c63", // uchu-yin-7
    },
  },
};
