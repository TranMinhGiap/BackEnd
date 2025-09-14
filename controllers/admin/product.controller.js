const Product = require("../../models/product.modal");
const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");

module.exports.index = async (req, res) => {
  let params = {
    deleted: false,
  }
  // xử lý lọc theo trạng thái
  // Button trạng thái
  const filterStatus = filterStatusHelper(req.query);
  // End button trạng thái
  if(req.query.status){
    params.status = req.query.status;
  }
  // End xử lý lọc theo trạng thái
  // Search
  const objectSearch = searchHelper(req.query);
  if(objectSearch.regex){
    params.title = objectSearch.regex;
  }
  // End Search
  
  //Pagination
  let objectPagination = {
    currentPage: 1,
    limitItems : 4,
    skip: 0
  };
  if(req.query.page){
    objectPagination.currentPage = parseInt(req.query.page);
    objectPagination.skip = (objectPagination.currentPage - 1) * objectPagination.limitItems;
  }
  const coutnProduct = await Product.countDocuments(params);
  const totalPage = Math.ceil(coutnProduct / objectPagination.limitItems);
  objectPagination.totalPage = totalPage;
  //End Pagination

  // ==== Truy vấn database dựa trên điều kiện params + trả kết quả về view hiển thị
  const products = await Product.find(params).limit(objectPagination.limitItems).skip(objectPagination.skip);
  // console.log(req.query);
  res.render("admin/pages/products/index", {
    pageTitle: "Products Admin",
    products: products,
    filterStatus: filterStatus,
    keyword: objectSearch.keyword,
    pagination: objectPagination
  })
}