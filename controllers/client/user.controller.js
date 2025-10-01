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
    res.cookie("token", user.tokenUser);
    // Chuyển hướng về trang chủ
    res.redirect(`/`);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Có lỗi xảy ra khi đăng ký tài khoản");
  }
};