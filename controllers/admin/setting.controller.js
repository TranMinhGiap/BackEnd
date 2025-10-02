const SettingGeneral = require("../../models/setting-general.modal");
// [GET] /admin/setting/general
module.exports.general = async (req, res) => {
  try {
    const settingGeneral = await SettingGeneral.findOne({});
    res.render("admin/pages/setting/general", {
      pageTitle: "Cài đặt chung",
      settingGeneral: settingGeneral
    })
  } catch (error) {
    console.log(error);
    res.status(500).send("Lỗi server");
  }
}
// [PATCH] /admin/setting/general
module.exports.generalPatch = async (req, res) => {
  try {
    const settingGeneral = await SettingGeneral.findOne({});
    if (settingGeneral) {
      // Update
      await SettingGeneral.updateOne({ _id: settingGeneral.id }, req.body);
    } else {
      console.log("Luu vao day");
      // Thêm mới
      const record = new SettingGeneral(req.body)
      await record.save();
    }
    res.redirect(req.get("Referrer") || "admin/settings/general");
  } catch (error) {
    console.log(error);
    res.status(500).send("Lỗi server");
  }
}