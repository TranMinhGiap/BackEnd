const Account = require("../../models/account.modal");
const systemConfig = require("../../config/system");

// MD5
const md5 = require('md5');
// MD5

// [GET] /admin/auth/login
module.exports.login = async (req, res) => {
  const token = req.cookies.token;
  const user = await Account.findOne({token: token});
  if (user) {
    res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
  } else {
    res.render("admin/pages/auth/index", {
      pageTitle: "Login"
    })
  }
}

// [POST] /admin/auth/login
module.exports.loginPost = async (req, res) => {
  try {
    const email = req.body.email;
    const password = md5(req.body.password);
    const user = await Account.findOne({
      email: email,
      deleted: false
    })
    if(!user){
      return res.status(400).send("Email không tồn tại!");
    }
    if(password !== user.password){
      return res.status(400).send("Sai mật khẩu!");
    }
    if(user.status === "inactive"){
      return res.status(400).send("Tài khoản đang bị khóa!");
    }
    res.cookie("token", user.token);
    res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Có lỗi xảy ra khi đăng nhập");
  }
}

// [GET] /admin/auth/logout
module.exports.logout = async (req, res) => {
  try {
    res.clearCookie("token")
    res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Có lỗi xảy ra khi đăng xuất");
  }
}