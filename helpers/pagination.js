module.exports = (objectPagination, query, coutnProduct) => {
  if (query.page) {
    objectPagination.currentPage = parseInt(query.page);
    objectPagination.skip = (objectPagination.currentPage - 1) * objectPagination.limitItems;
  }
  const totalPage = Math.ceil(coutnProduct / objectPagination.limitItems);
  objectPagination.totalPage = totalPage;

  return objectPagination;
}