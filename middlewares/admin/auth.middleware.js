const Account = require("../../models/account.modal");
const Role = require("../../models/role.modal")
const systemConfig = require("../../config/system");

module.exports.requireAuth = async (req, res, next) => {
  const token = req.cookies.token;
  if(token){
    const condition = {
      token: token
    };
    const user = await Account.findOne(condition).select("-password -token");
    if(!user){
      res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
      return;
    }else{
      const role = await Role.findOne({
        _id: user.role_id,
        deleted: false
      }).select("title permissions");
      res.locals.user = user;
      res.locals.role = role;
    }
  }else{
    res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
    return;
    // Hien them thong bao nhung chua lam
  }
  next();
}