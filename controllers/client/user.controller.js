const User = require("../../models/user.modal");
const Cart = require("../../models/cart.modal");
const ForgotPassword = require("../../models/forgot-password");

const generateHelper = require("../../helpers/generate");
// Send mail
const sendMailHelper = require("../../helpers/send-mail");
// End Send mail
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
// [GET] /user/password/forgot
module.exports.forgotPassword = async (req, res) => {
  try {
    res.render("client/pages/user/forgot-password", {
      pageTitle: "Quên mật khẩu"
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Có lỗi xảy ra hiển thị giao diện quên mật khẩu");
  }
};
// [GET] /user/password/otp
module.exports.otpPassword = async (req, res) => {
  try {
    const email = req.query.email;
    res.render("client/pages/user/otp-password", {
      pageTitle: "Quên mật khẩu",
      email: email
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Có lỗi xảy ra khi hiển thị giao diện nhập mã OTP");
  }
};
// [POST] /user/password/otp
module.exports.otpPasswordPost = async (req, res) => {
  // Xác nhận opt so với record trong db
  try {
    const email = req.body.email;
    const otp = req.body.otp;
    // Tìm record trong collection forgot-password tương ứng với email và otp
    const record = await ForgotPassword.findOne({
      email: email,
      otp: otp
    });
    if (!record) {
      return res.status(400).send("Mã OTP không đúng hoặc đã hết hạn ");
    } else {
      // Xóa record sau khi verify thành công (tùy chọn, để tránh dùng lại)
      await ForgotPassword.deleteOne({ _id: record._id });
      // Trả về token cho user để khi gửi yêu cầu reset mật khẩu dựa vào token để biết pass mới do đúng user nào gửi
      const user = await User.findOne({
        email: email,
        deleted: false,
        status: "active"
      });
      if(user){
        res.cookie("tokenUser", user.tokenUser);
      }
      // Chuyển hướng về trang đổi mật khẩu
      res.redirect(`/user/password/reset`);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send("Có lỗi xảy ra khi đăng đăng xuất tài khoản");
  }
};
// [POST] /user/password/forgot
module.exports.forgotPasswordPost = async (req, res) => {
  // Tạo otp + gửi về email
  try {
    const email = req.body.email;
    // Tìm người dùng
    const user = await User.findOne({
      email: email,
      deleted: false
    });
    if(!user){
      return res.status(400).send("Email không tồn tại");
    }
    if(user.status === "inactive"){
      return res.status(400).send("Tài khoản đã bị khóa");
    }
    // Tạo mã OTP và lưu email, mã OTP vào collection forgot-password
    const opt = generateHelper.generateRandomNumber(4);
    const forgotPassword = new ForgotPassword({
      email: email,
      otp: opt,
      expireAt: new Date(Date.now() + 3 * 60 * 1000)
    });
    await forgotPassword.save();
    // Gửi mã OTP về email
    const subject = "Mã OTP lấy lại mật khẩu";
    const html = `<p>Mã OTP của bạn là: <b>${opt}</b>. Mã có hiệu lực trong 3 phút !</p>`;
    // Gọi hàm gửi mail
    sendMailHelper.sendMail(email, subject, html);
    res.redirect(`/user/password/otp?email=${email}`);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Có lỗi xảy ra khi lấy lại tài khoản");
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
    // Lưu userId vào collection carts
    await Cart.updateOne({
      _id: req.cookies.cartId
    }, {
      user_id: user.id  
    });
    // Chuyển hướng về trang chủ
    res.redirect(`/`);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Có lỗi xảy ra khi đăng nhập tài khoản");
  }
};
// [GET] /user/password/reset
module.exports.resetPassword = async (req, res) => {
  res.render("client/pages/user/reset-password", {
    pageTitle: "Đặt lại mật khẩu"
  });
};
// [GET] /user/password/reset
module.exports.resetPasswordPost = async (req, res) => {
  const password = req.body.password;
  // Lấy token để xác nhận user và tìm user cần đổi mật khẩu
  const tokenUser = req.cookies.tokenUser;
  // Không có token thì không phải do chính user gửi yêu cầu, vì khi gửi xác nhận otp đã gửi token cho user rồi
  if(!tokenUser){
    return res.status(400).send("Yêu cầu không hợp lệ");
  }
  const user = await User.findOne({ tokenUser: tokenUser, deleted: false });
  if(!user){
    return res.status(400).send("Yêu cầu không hợp lệ");
  }
  if(user.status === "inactive"){
    return res.status(400).send("Tài khoản đã bị khóa");
  }
  // Đổi mật khẩu cho user
  await User.updateOne({ _id: user.id }, { password: md5(password) });
  // Do khi xác nhận email thì đã gửi token nên coi nhu đăng nhập vào hệ thống luôn nên không cần đăng nhập lại nữa
  res.redirect('/');
};
// [GET] /user/info
module.exports.info = async (req, res) => {
  // Lấy thông tin user thông qua token để hiển thị thông tin view
  const tokenUser = req.cookies.tokenUser;
  // Do không auth nên phải kiểm tra token nhỡ người khác gửi mà ta cũng cần biết ai thông qua token gửi để lấy thông tin
  if(!tokenUser){
    return res.redirect('/user/login');
  }
  const user = await User.findOne({ tokenUser: tokenUser, deleted: false, status: "active" });
  if(!user){
    return res.redirect('/user/login');
  }
  res.render("client/pages/user/info", {
    pageTitle: "Thông tin tài khoản",
    user: user
  });
};