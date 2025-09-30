const Cart = require("../../models/cart.modal");
// [POST] /cart/:productId
module.exports.addPost = async (req, res) => {
  try {
    const cartId = req.cookies.cartId;
    const productId = req.params.productId;
    const quantity = parseInt(req.body.quantity);
    const objectCart = {
      product_id: productId,
      quantity: quantity
    }
    const cart = await Cart.findOne({ _id: cartId });

    const exitProductInCart = cart.products.find(item => item.product_id === productId);

    if (exitProductInCart) {
      const newQuantity = quantity + exitProductInCart.quantity;
      await Cart.updateOne(
        {
          _id: cartId,
          'products.product_id': productId
        },
        {
          'products.$.quantity': newQuantity
        }
      )
    } else {
      await Cart.updateOne(
        { _id: cartId },
        {
          $push: { products: objectCart }
        }
      )
    }

    res.redirect(req.get("Referrer") || "/products");
  } catch (error) {
    console.error(error);
    return res.status(500).send("Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng");
  }
};