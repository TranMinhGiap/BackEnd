const Product = require("../../models/product.modal");
const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");

// [GET] admin/products
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
  const coutnProduct = await Product.countDocuments(params);
  let objectPagination = paginationHelper({
    currentPage: 1,
    limitItems : 4,
    skip: 0
  }, req.query, coutnProduct);
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
// [PATCH] admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  const status = req.params.status;
  const id = req.params.id;
  await Product.updateOne({ _id: id }, { status: status });
  // const redirectUrl = req.query.redirectUrl || "/admin/products";
  // res.redirect(redirectUrl);
  res.redirect(req.get("Referrer") || "/admin/products");
}
// [PATCH] admin/products/changeMulti
module.exports.changeMulti = async (req, res) => {
  const type = req.body.type;
  const ids = req.body.ids.split(", ");
  switch (type) {
    case "active":
      await Product.updateMany({ _id: { $in: ids} }, { status: "active" });
      break;
    case "inactive":
      await Product.updateMany({ _id: { $in: ids} }, { status: "inactive" });
      break;
    default:
      break;
  }
  res.redirect(req.get("Referrer") || "/admin/products");
}

// [DELETE] admin/products/delete/:id
module.exports.deleteItem = async (req, res) => {
  const idProduct = req.params.id;
  await Product.updateOne({ _id: idProduct }, { deleted: true });
  // Xóa mềm
  // Xóa cứng: await Product.deleteOne({ _id: idProduct });
  res.redirect(req.get("Referrer") || "/admin/products");
}