const Role = require("../../models/role.modal")
const systemConfig = require("../../config/system");

// [GET] /admin/roles
module.exports.index = async (req, res) => {
  try {
    let params = {
      deleted: false
    };
    const records = await Role.find(params);
    res.render("admin/pages/roles/index", {
      pageTitle: "Nhóm phân quyền",
      records: records
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
    const idRole = req.params.id;
    await Role.updateOne({ _id: idRole }, req.body);
    res.redirect(req.get("Referrer") || `${systemConfig.prefixAdmin}/roles`);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Có lỗi xảy ra khi chỉnh sửa nhóm quyền");
  }
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
    res.render("admin/pages/roles/detail", {
      pageTitle: "Chi tiết nhóm quyền",
      record: record
    })
  } catch (error) {
    console.error(error);
    return res.status(500).send("Có lỗi xảy ra khi xem chi tiết nhóm quyền");
  }
}