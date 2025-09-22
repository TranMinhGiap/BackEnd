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