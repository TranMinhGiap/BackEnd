const Cart = require("../../models/cart.modal");
const Product = require("../../models/product.modal");
const productHelper = require("../../helpers/product");
// [POST] /cart
module.exports.index = async (req, res) => {
  try {
    const cartId = req.cookies.cartId;
    const cart = await Cart.findOne({
      _id: cartId
    })
    if(cart.products.length > 0){
      let totalPriceCart = 0;
      for (let item of cart.products) {
        const idProduct = item.product_id;
        const productInfo = await Product.findOne({
          _id: idProduct,
          deleted: false,
          status: "active"
        })
        if(productInfo){
          productInfo.priceNew = productHelper.priceNewProduct(productInfo);
          item.productInfo = productInfo;
          item.totalPrice = item.quantity * productInfo.priceNew;
          totalPriceCart += item.totalPrice;
        }
      }
      cart.totalPriceCart = totalPriceCart;
    }
    res.render("client/pages/cart/index", {
      pageTitle: "Giỏ hàng",
      cartDetail: cart
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Có lỗi xảy ra khi hiển thị giỏ hàng");
  }
};
// [POST] /cart/add/:productId
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
// [GET] /cart/delete/:productId
module.exports.delete = async (req, res) => {
  try {
    // Lấy thông tin cart thông qua id trong cookie
    const cart = await Cart.findOne({ _id: req.cookies.cartId });
    // lấy id product cần xóa thông qua params
    const productId = req.params.productId;
    // Tiến hành xóa sản phẩm khi biết id sản phẩm cần xóa + cart (= cu phap mongoose)
    await Cart.updateOne(
      {
        _id: cart.id
      },{
        "$pull": { products: { "product_id": productId } }
      }
    );
    res.redirect(req.get("Referrer") || "/products");
  } catch (error) {
    console.error(error);
    return res.status(500).send("Có lỗi xảy ra khi xóa sản phẩm khỏi giỏ hàng");
  }
};
// [GET] /cart/update/:productId/:quantity
module.exports.update = async (req, res) => {
  try {
    // Lấy thông tin cart thông qua id trong cookie
    const cart = await Cart.findOne({ _id: req.cookies.cartId });
    // lấy id product, số lượng cần cập nhật thông qua params
    const productId = req.params.productId;
    const quantity = req.params.quantity;
    // Tiến hành cập nhật giở hành khi biết cart, sản phẩm và số lượng cần update
    await Cart.updateOne(
      {
        _id: cart.id,
        'products.product_id': productId
      },
      {
        'products.$.quantity': quantity
      }
    )
    res.redirect(req.get("Referrer") || "/products");
  } catch (error) {
    console.error(error);
    return res.status(500).send("Có lỗi xảy ra khi cập nhật sản phẩm trong giỏ hàng");
  }
};