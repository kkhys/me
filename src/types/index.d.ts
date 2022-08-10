type HomeContext = {
  isPublished: boolean[];
  limit: number;
};

type ArticleContext = {
  filePath: string;
  relatedArticles: any; // FIXME
};

type CategoryContext = {
  isPublished: boolean[];
  category: string;
  limit: number;
  skip: number;
  numberOfPages: number;
  currentPage: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
};

type Article = {
  handle: string;
  title: string;
  description?: string;
  emoji: string;
  category: string;
  createdAt: string;
  html: string;
};
