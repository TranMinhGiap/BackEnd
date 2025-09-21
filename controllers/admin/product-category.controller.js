const systemConfig = require("../../config/system");
const ProductCategory = require("../../models/product-category.modal");
const createTreeHelper = require("../../helpers/createTree");

// [GET] admin/products-category
module.exports.index = async (req, res) => {
  try {
    let params = {
      deleted: false,
    }
    const records = await ProductCategory.find(params);
    const newRecords = createTreeHelper.createTree(records);
    res.render("admin/pages/products-category/index", {
      pageTitle: "Product-Category",
      records: newRecords
    })
  } catch (error) {
    console.error(error);
    return res.status(500).send("Có lỗi xảy ra khi lấy danh mục!");
  }
}

// [GET] admin/products-category/create
module.exports.create = async (req, res) => {
  try {
    let params = {
      deleted: false,
    }
    const records = await ProductCategory.find(params);
    const newRecords = createTreeHelper.createTree(records);
    res.render("admin/pages/products-category/create", {
      pageTitle: "Create Product-Category",
      category: newRecords
    })
  } catch (error) {
    console.error(error);
    return res.status(500).send("Có lỗi xảy ra khi lấy danh mục!");
  }
}

// [POST] admin/products-category/create
module.exports.createPost = async (req, res) => {
  try {
    if (req.body.position === "") {
      const count = await ProductCategory.countDocuments();
      req.body.position = count + 1;
    }
    else {
      req.body.position = parseInt(req.body.position)
    }
    const record = new ProductCategory(req.body);
    await record.save();
  } catch (error) {
    console.error(error);
    return res.status(500).send("Có lỗi xảy ra khi tạo danh mục!");
  }
  res.redirect(`${systemConfig.prefixAdmin}/products-category`);
}