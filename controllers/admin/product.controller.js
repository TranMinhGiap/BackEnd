const Product = require("../../models/product.modal");
const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");

const systemConfig = require("../../config/system");

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

  // Sort
  let sort = {};
  if(req.query.sortKey && req.query.sortValue){
    sort[req.query.sortKey] = req.query.sortValue;
  }else{
    sort.position = "desc";
  }
  // End Sort

  // ==== Truy vấn database dựa trên điều kiện params + trả kết quả về view hiển thị
  const products = await Product.find(params)
    .sort(sort)
    .limit(objectPagination.limitItems)
    .skip(objectPagination.skip);
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
    case "deleted-all":
      await Product.updateMany({ _id: { $in: ids} }, { 
        deleted: true,
        deletedAt: new Date()
      });
      break;
    case "change-position":
      for (const item of ids) {
        let [id, position] = item.split("-");
        position = parseInt(position);
        // console.log(id)
        // console.log(position)
        await Product.updateOne({ _id: id }, { position: position });
        // Do giá trị update khác nhau nên buộc phải dùng for để update cho từng phần tử với các giá trị tưởng ứng
      }
      break;
    default:
      break;
  }
  res.redirect(req.get("Referrer") || "/admin/products");
}

// [DELETE] admin/products/delete/:id
module.exports.deleteItem = async (req, res) => {
  const idProduct = req.params.id;
  await Product.updateOne({ _id: idProduct }, { deleted: true, deletedAt: new Date() });
  // Xóa mềm
  // Xóa cứng: await Product.deleteOne({ _id: idProduct });
  res.redirect(req.get("Referrer") || "/admin/products");
}
// [GET] admin/products/create
module.exports.create = async (req, res) => {
  res.render("admin/pages/products/create", {
    pageTitle: "Products Create",
  })
}
// [POST] admin/products/create
module.exports.createPost = async (req, res) => {
  
  // if(req.file){
  //   req.body.thumbnail = `/uploads/${req.file.filename}`
  // }
  req.body.price = parseInt(req.body.price)
  req.body.discountPercentage = parseInt(req.body.discountPercentage)
  req.body.stock = parseInt(req.body.stock)
  if(req.body.position === ""){
    const countProduct = await Product.countDocuments();
    req.body.position = countProduct + 1;
  }
  else{
    req.body.position = parseInt(req.body.position)
  }
  const product = new Product(req.body);
  await product.save();
  res.redirect(`${systemConfig.prefixAdmin}/products`);
}
// [GET] admin/products/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const find = {
      deleted: false,
      _id: req.params.id
    };

    const product = await Product.findOne(find);

    res.render("admin/pages/products/edit", {
      pageTitle: "Products Edit",
      product: product
    })
  } catch (error) {
    // Co the hien thi them thong bao nhung dang loi thu vien nhu da de cap truoc do nen tam thoi bo qua thong bao
    res.redirect(`${systemConfig.prefixAdmin}/products`);
  }
}
// [PATCH] admin/products/edit/:id
module.exports.editPatch = async (req, res) => {
  const id = req.params.id;

  try {
    // if (req.file) {
    //   req.body.thumbnail = `/uploads/${req.file.filename}`
    // }
    req.body.price = parseInt(req.body.price)
    req.body.discountPercentage = parseInt(req.body.discountPercentage)
    req.body.stock = parseInt(req.body.stock)
    req.body.position = parseInt(req.body.position)

    await Product.updateOne({ _id: id }, req.body);

  } catch (error) {

  }
  res.redirect(req.get("Referrer") || `${systemConfig.prefixAdmin}/products`);
}
// [GET] admin/products/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const find = {
      deleted: false,
      _id: req.params.id
    };

    const product = await Product.findOne(find);

    res.render("admin/pages/products/detail", {
      pageTitle: `${product.title}`,
      product: product
    })
  } catch (error) {
    // Co the hien thi them thong bao nhung dang loi thu vien nhu da de cap truoc do nen tam thoi bo qua thong bao
    res.redirect(`${systemConfig.prefixAdmin}/products`);
  }
}