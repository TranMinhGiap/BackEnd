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
// [GET] admin/products-category/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const params = {
      deleted: false,
    };
    const category = await ProductCategory.find(params);
    const newcategory = createTreeHelper.createTree(category);
    params._id = req.params.id;
    const records = await ProductCategory.findOne(params);
    res.render(`admin/pages/products-category/edit`, {
      pageTitle: "Chỉnh sửa danh mục sản phẩm",
      records: records,
      categoryParent: newcategory
    })
  } catch (error) {
    console.error(error);
    return res.status(500).send("Có lỗi xảy ra khi tạo form chỉnh sửa danh mục!");
  }
}
// [PATCH] admin/products-category/edit/:id
module.exports.editPatch = async (req, res) => {
  try {
    const id = req.params.id;
    req.body.position = parseInt(req.body.position);
    await ProductCategory.updateOne({ _id: id }, req.body);
    res.redirect(req.get("Referrer") || `${systemConfig.prefixAdmin}/products-category`);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Có lỗi xảy ra khi chỉnh sửa danh mục!");
  }
}
// [DELETE] admin/products-category/delete/:id
module.exports.delete = async (req, res) => {
  try {
    const id = req.params.id;
    await ProductCategory.updateOne({ _id: id }, { deleted: true, deletedAt: new Date() });
    res.redirect(req.get("Referrer") || `${systemConfig.prefixAdmin}/products-category`);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Có lỗi xảy ra khi xóa danh mục!");
  }
}
// [GET] admin/products-category/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const id = req.params.id;
    const params = {
      deleted: false,
      _id: id
    }
    const record = await ProductCategory.findOne(params);
    const parentCategoryId = record.parent_id;
    let categoryParent = null;
    if(parentCategoryId){
      categoryParent = await ProductCategory.findOne({ _id: record.parent_id })
    }
    res.render("admin/pages/products-category/detail", {
      pageTitle: "Chi tiết danh mục",
      record: record,
      categoryParent: categoryParent
    })
  } catch (error) {
    console.error(error);
    return res.status(500).send("Có lỗi xảy ra khi xem chi tiết danh mục!");
  }
}