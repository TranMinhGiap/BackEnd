const Account = require("../../models/account.modal");
const systemConfig = require("../../config/system");

module.exports.requireAuth = async (req, res, next) => {
  const token = req.cookies.token;
  if(token){
    const condition = {
      token: token
    };
    const user = await Account.findOne(condition);
    if(!user){
      res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
      return;
    }
  }else{
    res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
    return;
    // Hien them thong bao nhung chua lam
  }
  next();
}