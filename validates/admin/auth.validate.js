module.exports.loginPost = (req, res, next) => {
  if(!req.body.email){
    res.redirect(req.get("Referrer") || `${systemConfig.prefixAdmin}/auth/login`);
    return;
  }
  if(!req.body.password){
    res.redirect(req.get("Referrer") || `${systemConfig.prefixAdmin}/auth/login`);
    return;
  }
  next();
}
// Tam thoi chua cho in thong bao vi loi thu vien nen redirect luon
