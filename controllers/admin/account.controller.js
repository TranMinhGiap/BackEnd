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
      // User create
      const idAccount = record.createdBy.account_id;
      const user = await Account.findOne({ _id: idAccount }).select("-password -token");
      if(user){
        record.userName = user.fullName;
        record.date = record.createdBy.createdAt;
      }
      // End User create
      // User last update
      if (record.updatedBy.length > 0) {
        const userLastUpdate = record.updatedBy[record.updatedBy.length - 1];
        const accountId = userLastUpdate.account_id;
        const userNameUpdate = await Account.findOne({ _id: accountId }).select("fullName");
        userLastUpdate.userName = userNameUpdate.fullName;
        // Nen tra ve day du thong tin cua tai khoan nho cho khac con dung nhưng đôi khi không cần trả đủ
      }
      // End User last update
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
      req.body.createdBy = {
        account_id: res.locals.user.id
      }
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
      const updatedBy = {
        account_id: res.locals.user.id,
        updatedAt: new Date()
      };
      await Account.updateOne({ _id: idAccount }, {
        ... req.body,
        $push: { updatedBy: updatedBy }
      });
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
  res.redirect(req.get("Referrer") || "/admin/accounts");
}

// [PATCH] admin/accounts/changeMulti
module.exports.changeMulti = async (req, res) => {
  const type = req.body.type;
  const ids = req.body.ids.split(", ");
  const updatedBy = {
    account_id: res.locals.user.id,
    updatedAt: new Date()
  };
  switch (type) {
    case "active":
      await Account.updateMany({ _id: { $in: ids} }, { 
        status: "active",
        $push: { updatedBy: updatedBy }
      });
      break;
    case "inactive":
      await Account.updateMany({ _id: { $in: ids} }, { 
        status: "inactive",
        $push: { updatedBy: updatedBy } 
      });
      break;
    case "deleted-all":
      const infoDelete = {
        account_id: res.locals.user.id,
        deletedAt: new Date()
      }
      await Account.updateMany({ _id: { $in: ids} }, { 
        deleted: true,
        deletedBy: infoDelete
      });
      break;
    default:
      break;
  }
  res.redirect(req.get("Referrer") || "/admin/accounts");
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
    // User create
    const idUserCreate = record.createdBy.account_id;
    const user = await Account.findOne({ _id: idUserCreate }).select("-password -token");
    if (user) {
      record.userName = user.fullName;
      record.date = record.createdBy.createdAt;
    }
    // End User create
    // User delete
    const idUserDelete = record.deletedBy.account_id;
    const userDelete = await Account.findOne({ _id: idUserDelete, deleted: false }).select("-password -token");
    if (userDelete) {
      record.userNameDelete = userDelete ? userDelete.fullName : "Tài khoản đã bị xóa hoặc không tồn tại";
      record.dateDelete = record.deletedBy.deletedAt;
    }
    // End User delete
    // User last update
    if (record.updatedBy.length > 0) {
      const userLastUpdate = record.updatedBy[record.updatedBy.length - 1];
      const accountId = userLastUpdate.account_id;
      const userNameUpdate = await Account.findOne({ _id: accountId, deleted: false }).select("fullName");
      userLastUpdate.userName = userNameUpdate ? userNameUpdate.fullName : "Tài khoản đã bị xóa hoặc không tồn tại";
      // Nen tra ve day du thong tin cua tai khoan nho cho khac con dung nhưng đôi khi không cần trả đủ
    }
    // End User last delete
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
    const infoDelete = {
      account_id: res.locals.user.id,
      deletedAt: new Date()
    }
    await Account.updateOne({ _id: idAccount }, { deleted: true, deletedBy: infoDelete });
    res.redirect(req.get("Referrer") || `${systemConfig.prefixAdmin}/accounts`);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Có lỗi xảy ra khi xóa tài khoản");
  }
}