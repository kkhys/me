export const formatPublishedDate = (publishedDate: Date | string | number) =>
  new Date(publishedDate).toISOString().split("T")[0];
