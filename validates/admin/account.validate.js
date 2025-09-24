module.exports.createPost = (req, res, next) => {
  if(!req.body.fullName){
    res.redirect(req.get("Referrer") || `${systemConfig.prefixAdmin}/roles`);
    return;
  }
  if(!req.body.password){
    res.redirect(req.get("Referrer") || `${systemConfig.prefixAdmin}/roles`);
    return;
  }
  if(!req.body.email){
    res.redirect(req.get("Referrer") || `${systemConfig.prefixAdmin}/roles`);
    return;
  }
  next();
}
// Tam thoi chua cho in thong bao vi loi thu vien nen redirect luon
module.exports.editPatch = (req, res, next) => {
  if(!req.body.fullName){
    res.redirect(req.get("Referrer") || `${systemConfig.prefixAdmin}/roles`);
    return;
  }
  if(!req.body.email){
    res.redirect(req.get("Referrer") || `${systemConfig.prefixAdmin}/roles`);
    return;
  }
  next();
}