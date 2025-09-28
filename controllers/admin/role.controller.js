const Role = require("../../models/role.modal");
const Account = require("../../models/account.modal");
const systemConfig = require("../../config/system");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");

// [GET] /admin/roles
module.exports.index = async (req, res) => {
  try {
    let params = {
      deleted: false
    };
    // Search
    const objectSearch = searchHelper(req.query);
    if (objectSearch.regex) {
      params.title = objectSearch.regex;
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
    const coutnRole = await Role.countDocuments(params);
    let objectPagination = paginationHelper({
      currentPage: 1,
      limitItems: 5,
      skip: 0
    }, req.query, coutnRole);
    //End Pagination
    const records = await Role.find(params)
      .sort(sort)
      .limit(objectPagination.limitItems)
      .skip(objectPagination.skip);
    for (const record of records) {
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
        const userNameUpdate = await Account.findOne({ _id: accountId, deleted: false }).select("fullName");
        userLastUpdate.userName = userNameUpdate ? userNameUpdate.fullName : "Tài khoản đã bị xóa hoặc không tồn tại";
        // Nen tra ve day du thong tin cua tai khoan nho cho khac con dung nhưng đôi khi không cần trả đủ
      }
      // End User last update
    }
    res.render("admin/pages/roles/index", {
      pageTitle: "Nhóm phân quyền",
      keyword: objectSearch.keyword,
      records: records,
      pagination: objectPagination
    })
  } catch (error) {
    console.error(error);
    return res.status(500).send("Có lỗi xảy ra khi hiển thị nhóm phân quyền");
  }
}
// [GET] /admin/roles/create
module.exports.create = async (req, res) => {
  try {
    res.render("admin/pages/roles/create", {
      pageTitle: "Tạo nhóm phân quyền",
    })
  } catch (error) {
    console.error(error);
    return res.status(500).send("Có lỗi xảy ra khi hiển thị nhóm phân quyền");
  }
}
// [POST] /admin/roles/create
module.exports.createPost = async (req, res) => {
  try {
    req.body.createdBy = {
      account_id: res.locals.user.id
    }
    const record = new Role(req.body);
    await record.save();
    res.redirect(`${systemConfig.prefixAdmin}/roles`);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Có lỗi xảy ra khi hiển thị nhóm phân quyền");
  }
}
// [GET] /admin/roles/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const params = {
      deleted: false,
      _id: req.params.id
    };
    const record = await Role.findOne(params);
    res.render("admin/pages/roles/edit", {
      pageTitle: "Chỉnh sửa nhóm quyền",
      record: record
    })
  } catch (error) {
    console.error(error);
    return res.status(500).send("Có lỗi xảy ra khi chỉnh sửa nhóm quyền");
  }
}
// [PATCH] /admin/roles/edit/:id
module.exports.editPatch = async (req, res) => {
  try {
    const updatedBy = {
      account_id: res.locals.user.id,
      updatedAt: new Date()
    };
    const idRole = req.params.id;
    await Role.updateOne({ _id: idRole }, {
      ...req.body,
      $push: { updatedBy: updatedBy }
    });
    res.redirect(req.get("Referrer") || `${systemConfig.prefixAdmin}/roles`);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Có lỗi xảy ra khi chỉnh sửa nhóm quyền");
  }
}
// [PATCH] admin/products/changeMulti
module.exports.changeMulti = async (req, res) => {
  const type = req.body.type;
  const ids = req.body.ids.split(", ");
  switch (type) {
    case "deleted-all":
      const infoDelete = {
        account_id: res.locals.user.id,
        deletedAt: new Date()
      }
      await Role.updateMany({ _id: { $in: ids} }, { 
        deleted: true,
        deletedBy: infoDelete
      });
      break;
    default:
      break;
  }
  res.redirect(req.get("Referrer") || "/admin/roles");
}
// [GET] /admin/roles/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const idRole = req.params.id;
    const params = {
      deleted: false,
      _id: idRole
    }
    const record = await Role.findOne(params);
    // User create
    const idUserCreate = record.createdBy.account_id;
    const user = await Account.findOne({ _id: idUserCreate, deleted: false }).select("fullName");
    record.userName = user ? user.fullName : "Tài khoản đã bị xóa hoặc không tồn tại";
    record.date = record.createdBy.createdAt;
    // End User create
    // User delete
    const idUserDelete = record.deletedBy.account_id;
    const userDelete = await Account.findOne({ _id: idUserDelete, deleted: false }).select("fullName");
    record.userNameDelete = userDelete ? userDelete.fullName : "Tài khoản đã bị xóa hoặc không tồn tại";
    record.dateDelete = record.deletedBy.deletedAt;
    // End User delete
    // User last update
    if (record.updatedBy.length > 0) {
      const userLastUpdate = record.updatedBy[record.updatedBy.length - 1];
      const accountId = userLastUpdate.account_id;
      const userNameUpdate = await Account.findOne({ _id: accountId, deleted: false }).select("fullName");
      userLastUpdate.userName = userNameUpdate ? userNameUpdate.fullName : "Tài khoản đã bị xóa hoặc không tồn tại";
    }
    // End User last delete
    res.render("admin/pages/roles/detail", {
      pageTitle: "Chi tiết nhóm quyền",
      record: record
    })
  } catch (error) {
    console.error(error);
    return res.status(500).send("Có lỗi xảy ra khi xem chi tiết nhóm quyền");
  }
}
// [DELETE] /admin/roles/delete/:id
module.exports.delete = async (req, res) => {
  try {
    const idRole = req.params.id;
    const infoDelete = {
      account_id: res.locals.user.id,
      deletedAt: new Date()
    }
    await Role.updateOne({ _id: idRole }, { deleted: true, deletedBy: infoDelete });
    res.redirect(req.get("Referrer") || `${systemConfig.prefixAdmin}/roles`);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Có lỗi xảy ra khi xóa tiết nhóm quyền");
  }
}
// [GET] /admin/roles/permissions
module.exports.permissions = async (req, res) => {
  try {
    let params = {
      deleted: false
    };
    const records = await Role.find(params);
    res.render("admin/pages/roles/permissions", {
      pageTitle: "Phân quyền",
      records: records
    })
  } catch (error) {
    console.error(error);
    return res.status(500).send("Có lỗi xảy ra khi phân quyền");
  }
}
// [PATCH] /admin/roles/permissions
module.exports.permissionsPatch = async (req, res) => {
  try {
    const permissions = JSON.parse(req.body.permissions);
    const updatedBy = {
      account_id: res.locals.user.id,
      updatedAt: new Date()
    };
    for (let item of permissions){
      const id = item.id;
      const perms = item.permissions;
      await Role.updateOne({ _id: id }, {
        permissions: perms,
        $push: { updatedBy: updatedBy }
      });
    }
    res.redirect(req.get("Referrer") || `${systemConfig.prefixAdmin}/roles`);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Có lỗi xảy ra khi cập nhật quyền");
  }
}