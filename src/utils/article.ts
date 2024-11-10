export const formatArticle = (article: string) =>
  article.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
