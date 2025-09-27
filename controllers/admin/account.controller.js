const Account = require("../../models/account.modal");
const Role = require("../../models/role.modal")
const systemConfig = require("../../config/system");
const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");

// MD5
const md5 = require('md5');
// MD5

// [GET] /admin/accounts
module.exports.index = async (req, res) => {
  try {
    let params = {
      deleted: false
    }
    // Fillter Status
    const filterStatus = filterStatusHelper(req.query);
    if (req.query.status) {
      params.status = req.query.status;
    }
    // End Fillter Status
    // Search
    const objectSearch = searchHelper(req.query);
    if (objectSearch.regex) {
      params.fullName = objectSearch.regex;
    }
    // End Search
    // Sort
    let sort = {};
    if (req.query.sortKey && req.query.sortValue) {
      sort[req.query.sortKey] = req.query.sortValue;
    } else {
      sort.createdAt = "desc";
    }
    // End Sort
    //Pagination
    const coutnProduct = await Account.countDocuments(params);
    let objectPagination = paginationHelper({
      currentPage: 1,
      limitItems: 5,
      skip: 0
    }, req.query, coutnProduct);
    //End Pagination
    const records = await Account.find(params)
      .sort(sort)
      .limit(objectPagination.limitItems)
      .skip(objectPagination.skip)
      .select("-password -token");
    for (const record of records) {
      const role = await Role.findOne({ _id: record.role_id, deleted: false })
      record.role = role.title;
    }
    res.render("admin/pages/account/index", {
      pageTitle: "Tài khoản",
      records: records,
      keyword: objectSearch.keyword,
      pagination: objectPagination,
      filterStatus: filterStatus
    })
  } catch (error) {
    console.error(error);
    return res.status(500).send("Có lỗi xảy ra khi xem tài khoản");
  }
}

// [GET] /admin/accounts/create
module.exports.create = async (req, res) => {
  const params = {
    deleted: false
  };
  const records = await Role.find(params);
  res.render("admin/pages/account/create", {
    pageTitle: "Tạo tài khoản",
    records: records
  })
}

// [POST] /admin/accounts/create
module.exports.createPost = async (req, res) => {
  try {
    // console.log(req.body);
    const emailExit = await Account.findOne({
      email: req.body.email,
      deleted: false
    });
    // Co the kiem tra them truong khac nhu phone, ...
    // console.log(emailExit);
    if(emailExit){
      // Trả về cảnh bảo nhưng lỗi thư viện thông báo nên redirect/send tam
      return res.status(400).send("Email đã tồn tại");
    }else{
      req.body.password = md5(req.body.password);
      const record = new Account(req.body);
      await record.save();
      res.redirect(`${systemConfig.prefixAdmin}/accounts`);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send("Có lỗi xảy ra khi thêm tài khoản");
  }
}

// [GET] /admin/accounts/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const params = {
      _id: req.params.id,
      deleted: false
    };
    const record = await Account.findOne(params);
    const permissions = await Role.find({ deleted: false });
    res.render("admin/pages/account/edit", {
      pageTitle: "Chỉnh sửa tài khoản",
      record: record,
      permissions: permissions
    })
  } catch (error) {
    console.error(error);
    return res.status(500).send("Có lỗi xảy ra khi thêm tài khoản");
  }
}

// [PATCH] /admin/accounts/edit/:id
module.exports.editPatch = async (req, res) => {
  try {
    const idAccount = req.params.id;

    const emailExit = await Account.findOne({
      _id: { $ne: idAccount },
      email: req.body.email,
      deleted: false
    });

    if (emailExit) {
      return res.status(400).send("Email đã tồn tại");
    } else {
      if (req.body.password) {
        req.body.password = md5(req.body.password);
      } else {
        delete req.body.password;
      }
      await Account.updateOne({ _id: idAccount }, req.body);
      res.redirect(req.get("Referrer") || `${systemConfig.prefixAdmin}/accounts`);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send("Có lỗi xảy ra khi thêm tài khoản");
  }
}
// Có thể thông báo nhưng lỗi thư viện hay sao ý nên chưa làm :))

// [PATCH] admin/accounts/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  const status = req.params.status;
  const id = req.params.id;
  const updatedBy = {
    account_id: res.locals.user.id,
    updatedAt: new Date()
  };
  await Account.updateOne({ _id: id }, { 
    status: status,
    $push: { updatedBy: updatedBy } 
  });
  res.redirect(req.get("Referrer") || "/admin/products");
}

// [GET] /admin/accounts/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const idAccount = req.params.id;
    let params = {
      _id: idAccount,
      deleted: false
    }
    const record = await Account.findOne(params).select("-password -token");
    const role = await Role.findOne({ _id: record.role_id, deleted: false });
    record.role = role.title;
    res.render("admin/pages/account/detail", {
      pageTitle: "Tài khoản",
      record: record
  })
  } catch (error) {
    console.error(error);
    return res.status(500).send("Có lỗi xảy ra khi xem chi tiết tài khoản");
  }
}

// [DELETE] /admin/accounts/delete/:id
module.exports.delete = async (req, res) => {
  try {
    const idAccount = req.params.id;
    await Account.updateOne({ _id: idAccount }, { deleted: true, deletedAt: new Date() });
    res.redirect(req.get("Referrer") || `${systemConfig.prefixAdmin}/accounts`);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Có lỗi xảy ra khi xóa tài khoản");
  }
}