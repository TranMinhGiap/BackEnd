const Account = require("../../models/account.modal");
const Role = require("../../models/role.modal")
const systemConfig = require("../../config/system");

// MD5
const md5 = require('md5');
// MD5

// [GET] /admin/accounts
module.exports.index = async (req, res) => {
  let params = {
    deleted: false
  }
  const records = await Account.find(params).select("-password -token");
  for (const record of records){
    const role = await Role.findOne({ _id: record.role_id, deleted: false })
    record.role = role.title;
  }
  // Cách khác
  // let role = {};
  // for (const acc of records){
  //   const idRole = acc.role_id;
  //   const roleItem = await Role.findOne({ _id: idRole, deleted: false });
  //   role[idRole] = roleItem.title;
  // }
  // forEach không được thiết kế để xử lý các tác vụ đồng bộ
  res.render("admin/pages/account/index", {
    pageTitle: "Tài khoản",
    records: records
    // role: role
  })
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