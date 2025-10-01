module.exports.registerPost = async (req, res, next) => {
  if(!req.body.fullName || !req.body.email || !req.body.password){
    return res.status(400).send("Vui lòng nhập đầy đủ thông tin");
  }
  next();
}