const Account = require("../../models/account.modal");
const systemConfig = require("../../config/system");

// MD5
const md5 = require('md5');
// MD5

// [GET] /admin/my-account
module.exports.index = (req, res) => {
  res.render("admin/pages/my-account/index", {
    pageTitle: "Thông tin cá nhân"
  })
}
// [GET] /admin/my-account/edit
module.exports.edit = (req, res) => {
  res.render("admin/pages/my-account/edit", {
    pageTitle: "Chinh sửa thông tin cá nhân"
  })
}
// [PATCH] /admin/my-account/edit
module.exports.editPatch = async (req, res) => {
  try {
    const idAccount = res.locals.user.id;

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
        ...req.body,
        $push: { updatedBy: updatedBy }
      });
      res.redirect(req.get("Referrer") || `${systemConfig.prefixAdmin}/my_account`);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send("Có lỗi xảy ra khi chỉnh sửa thông tin tài khoản");
  }
}
// Do user la bien toan cuc trong req nen khong can truyen tu controller xuong nua