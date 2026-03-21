export interface OssProject {
  slug: string;
  name: string;
  url: string;
  createdAt: string; // ISO 8601
}

export const ossProjects: OssProject[] = [
  {
    slug: "gh-labeler",
    name: "gh-labeler",
    url: "https://github.com/kkhys/gh-labeler",
    createdAt: "2025-09-07T01:54:02Z",
  },
  {
    slug: "jetbrains-ai-co-author",
    name: "jetbrains-ai-co-author",
    url: "https://github.com/kkhys/jetbrains-ai-co-author",
    createdAt: "2025-08-22T13:47:34Z",
  },
];
