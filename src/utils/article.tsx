export const formatArticle = (article: string) => {
  return article.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
};
