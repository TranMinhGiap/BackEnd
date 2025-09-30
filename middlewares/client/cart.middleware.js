const Cart = require("../../models/cart.modal");

module.exports.cartId = async (req, res, next) => {
  if (req.cookies.cartId) {
    const cart = await Cart.findOne({_id: req.cookies.cartId})
    cart.totalQuantity = cart.products.reduce((total, curr) => total + curr.quantity, 0)
    res.locals.miniCart = cart;
  } else {
    // Khi chưa có giỏ hàng thì phải tạo và lưu vào database và lưu id giỏ hàng vào cookie
    const cart = new Cart();
    await cart.save();
    const expiresTime = 1000 * 60 *60 * 24 * 365;
    res.cookie("cartId", cart.id, { 
      expires: new Date(Date.now() + expiresTime) 
    });
  }
  next();
}