type ArticlePageContext = {
  slug: string;
  relatedArticles: readonly GatsbyTypes.MarkdownRemarkEdge[];
};

type NewPageContext = {
  isPublished: boolean;
  limit: number;
  skip: number;
  numberOfPages: number;
  currentPage: number;
  hasPrevPage: number;
  hasNextPage: number;
};

export type { ArticlePageContext, NewPageContext };
