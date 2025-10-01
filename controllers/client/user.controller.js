const User = require("../../models/user.modal");
// MD5
const md5 = require('md5');
// MD5
// [GET] /user/register
module.exports.register = async (req, res) => {
  try {
    res.render("client/pages/user/register", {
      pageTitle: "Đăng ký tài khoản"
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Có lỗi xảy ra khi đăng ký tài khoản");
  }
};
// [GET] /user/login
module.exports.login = async (req, res) => {
  try {
    res.render("client/pages/user/login", {
      pageTitle: "Đăng nhập tài khoản"
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Có lỗi xảy ra khi đăng ký tài khoản");
  }
};
// [GET] /user/logout
module.exports.logout = async (req, res) => {
  try {
    res.clearCookie("tokenUser");
    // Chuyển hướng về trang đăng nhập
    res.redirect(`/user/login`);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Có lỗi xảy ra khi đăng đăng xuất tài khoản");
  }
};
// [POST] /user/register
module.exports.registerPost = async (req, res) => {
  try {
    // Thêm validate !
    // Kiểm tra email đã tồn tại chưa
    const emailExit = await User.findOne({
      email: req.body.email
    });
    // Email tồn tại thì thông báo lỗi
    if(emailExit){
      return res.status(400).send("Email đã tồn tại");
    }
    // Mã hóa mật khẩu
    req.body.password = md5(req.body.password);
    // Tạo người dùng
    const user = new User(req.body);
    await user.save();
    // Lưu token vào cookie
    res.cookie("tokenUser", user.tokenUser);
    // Chuyển hướng về trang chủ
    res.redirect(`/`);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Có lỗi xảy ra khi đăng ký tài khoản");
  }
};
// [POST] /user/login
module.exports.loginPost = async (req, res) => {
  try {
    const email = req.body.email;
    const password = md5(req.body.password);
    // Tìm người dùng
    const user = await User.findOne({
      email: email,
      deleted: false
    });
    if(!user){
      return res.status(400).send("Email không tồn tại");
    }
    if(user.password !== password){
      return res.status(400).send("Mật khẩu không đúng");
    }
    if(user.status === "inactive"){
      return res.status(400).send("Tài khoản đã bị khóa");
    }
    res.cookie("tokenUser", user.tokenUser);
    // Chuyển hướng về trang chủ
    res.redirect(`/`);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Có lỗi xảy ra khi đăng nhập tài khoản");
  }
};