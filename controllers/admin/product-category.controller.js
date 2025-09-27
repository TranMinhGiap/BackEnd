const systemConfig = require("../../config/system");
const ProductCategory = require("../../models/product-category.modal");
const Account = require("../../models/account.modal");
const createTreeHelper = require("../../helpers/createTree");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");
const filterStatusHelper = require("../../helpers/filterStatus");

// [GET] admin/products-category
module.exports.index = async (req, res) => {
  try {
    let params = {
      deleted: false,
    }
    let nomalDraw = false;
     // Search
    const objectSearch = searchHelper(req.query);
    if (objectSearch.regex) {
      params.title = objectSearch.regex;
      nomalDraw = true;
    }
    // End Search
    
    // Filter status
    const filterStatus = filterStatusHelper(req.query);
    if (req.query.status) {
      params.status = req.query.status;
      nomalDraw = true;
    }
    // End Filter status

    // Sort
    let sort = {};
    if (req.query.sortKey && req.query.sortValue) {
      sort[req.query.sortKey] = req.query.sortValue;
      nomalDraw = true;
    } else {
      sort.position = "desc";
      nomalDraw = true;
    }
    // End Sort

    // Pagination (Xu ly yeu cau client)
    const countCategory = await ProductCategory.countDocuments(params);
    let objectPagination = paginationHelper({
      currentPage: 1,
      limitItems: 5,
      skip: 0
    }, req.query, countCategory);
    if(req.query.page){
      nomalDraw = true;
    }
    // End Pagination

    // =================================================
    const records = await ProductCategory.find(params)
      .sort(sort)
      .limit(objectPagination.limitItems)
      .skip(objectPagination.skip);
    for (const record of records) {
      // User tao
      const idAccount = record.createdBy.account_id;
      const user = await Account.findOne({ _id: idAccount, deleted: false }).select("-password -token");
      if(user){
        record.userName = user.fullName,
        record.date = record.createdBy.createdAt
      }
      // End User tao
      // User cap nhat gan nhat
      if(record.updatedBy.length > 0){
        const userLastUpdate = record.updatedBy[record.updatedBy.length - 1];
        const accountId = userLastUpdate.account_id;
        const userName = await Account.findOne({ _id: accountId }).select("-password -token");
        userLastUpdate.userName = userName;
        // Nen tra ve day du thong tin cua tai khoan nho cho khac con dung
      }
      // End User cap nhat gan nhat
    }
    const newRecords = createTreeHelper.createTree(records);
    res.render("admin/pages/products-category/index", {
      pageTitle: "Product-Category",
      records: newRecords,
      keyword: objectSearch.keyword,
      nomalDraw: {
        check: nomalDraw,
        records: records
      },
      pagination: objectPagination,
      filterStatus: filterStatus,
    })
  } catch (error) {
    console.error(error);
    return res.status(500).send("Có lỗi xảy ra khi lấy danh mục!");
  }
}

// [PATCH] admin/products-category/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  const status = req.params.status;
  const id = req.params.id;
  const updatedBy = {
    account_id: res.locals.user.id,
    updatedAt: new Date()
  };
  await ProductCategory.updateOne({ _id: id }, { 
    status: status,
    $push: { updatedBy: updatedBy } 
  });
  res.redirect(req.get("Referrer") || "/admin/products-category");
}

// [PATCH] admin/products/changeMulti
module.exports.changeMulti = async (req, res) => {
  const type = req.body.type;
  const ids = req.body.ids.split(", ");
  const updatedBy = {
    account_id: res.locals.user.id,
    updatedAt: new Date()
  };
  switch (type) {
    case "active":
      await ProductCategory.updateMany({ _id: { $in: ids} }, { 
        status: "active",
        $push: { updatedBy: updatedBy }
      });
      break;
    case "inactive":
      await ProductCategory.updateMany({ _id: { $in: ids} }, { 
        status: "inactive",
        $push: { updatedBy: updatedBy } 
      });
      break;
    case "deleted-all":
      const infoDelete = {
        account_id: res.locals.user.id,
        deletedAt: new Date()
      }
      await ProductCategory.updateMany({ _id: { $in: ids} }, { 
        deleted: true,
        deletedBy: infoDelete
      });
      break;
    case "change-position":
      for (const item of ids) {
        let [id, position] = item.split("-");
        position = parseInt(position);
        // console.log(id)
        // console.log(position)
        await ProductCategory.updateOne({ _id: id }, { 
          position: position,
          $push: { updatedBy: updatedBy }
        });
        // Do giá trị update khác nhau nên buộc phải dùng for để update cho từng phần tử với các giá trị tưởng ứng
      }
      break;
    default:
      break;
  }
  res.redirect(req.get("Referrer") || "/admin/products-category");
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
    req.body.createdBy = {
      account_id: res.locals.user.id
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
    const updatedBy = {
      account_id: res.locals.user.id,
      updatedAt: new Date()
    };
    const id = req.params.id;
    req.body.position = parseInt(req.body.position);
    await ProductCategory.updateOne({ _id: id }, {
      ...req.body,
      $push: { updatedBy: updatedBy }
    });
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
    const infoDelete = {
      account_id: res.locals.user.id,
      deletedAt: new Date()
    }
    await ProductCategory.updateOne({ _id: id }, { deleted: true, deletedBy: infoDelete });
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
    // User tao
    const idAccount = record.createdBy.account_id;
    const user = await Account.findOne({ _id: idAccount, deleted: false }).select("-password -token");
    if (user) {
      record.userName = user.fullName;
      record.date = record.createdBy.createdAt
    }
    // End User tao
    // User cap nhat gan nhat
    if(record.updatedBy.length > 0){
      const userLastUpdate = record.updatedBy[record.updatedBy.length - 1];
      const accountId = userLastUpdate.account_id;
      const userName = await Account.findOne({ _id: accountId }).select("-password -token");
      userLastUpdate.userName = userName;
    }
    // End User cap nhat gan nhat
    res.render("admin/pages/products-category/detail", {
      pageTitle: "Chi tiết danh mục",
      record: record,
      categoryParent: categoryParent
      // Cach khac la them truc tiep 1 thuoc tinh vao doi tuong
    })
  } catch (error) {
    console.error(error);
    return res.status(500).send("Có lỗi xảy ra khi xem chi tiết danh mục!");
  }
}