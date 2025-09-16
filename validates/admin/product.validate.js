module.exports.createPost = (req, res, next) => {
  if (!req.body.title) {
    res.redirect(req.get("Referrer") || "/admin/products");
    console.log("da validate title!");
    return;
    // return để không chạy tiếp xuống !
    // redirect tạm vì như đã đề cập trước đó thư viện thông báo lỗi thì phải nên ta chỉ back về giao diện chứ không hiển thị thông báo gì cho FE
  }
  next();
}