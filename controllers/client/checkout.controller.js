const Cart = require("../../models/cart.modal");
const Product = require("../../models/product.modal");
const productHelper = require("../../helpers/product");

// [GET] /checkout/
module.exports.index = async (req, res) => {
  try {
    const cartId = req.cookies.cartId;
    const cart = await Cart.findOne({
      _id: cartId
    })
    if (cart.products.length > 0) {
      let totalPriceCart = 0;
      for (let item of cart.products) {
        const idProduct = item.product_id;
        const productInfo = await Product.findOne({
          _id: idProduct,
          deleted: false,
          status: "active"
        })
        if (productInfo) {
          productInfo.priceNew = productHelper.priceNewProduct(productInfo);
          item.productInfo = productInfo;
          item.totalPrice = item.quantity * productInfo.priceNew;
          totalPriceCart += item.totalPrice;
        }
      }
      cart.totalPriceCart = totalPriceCart;
    }
    res.render("client/pages/checkout/index", {
      pageTitle: "Đặt hàng",
      cartDetail: cart
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Có lỗi xảy ra khi hiển giao diện checkout");
  }
};
