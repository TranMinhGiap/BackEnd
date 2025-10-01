const User = require("../../models/user.modal");
module.exports.infoUser = async (req, res, next) => {
  const tokenUser = req.cookies.tokenUser;
  if(tokenUser){
    const user = await User.findOne({
      tokenUser: tokenUser,
      deleted: false,
      status: "active"
    }).select("-password -tokenUser");
    if(user){
      res.locals.user = user;
    }
    else{
      res.locals.user = null;
    }
  }
  else{
    res.locals.user = null;
  }
  next();
}