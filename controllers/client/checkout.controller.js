const Cart = require("../../models/cart.modal");
const Product = require("../../models/product.modal");
const Order = require("../../models/order.modal");
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
// [POST] /checkout/order
module.exports.order = async (req, res) => {
  try {
    // Lấy cartId từ cookie
    const cartId = req.cookies.cartId;  
    // Lấy thông tin người dùng từ form
    const userInfo = req.body;
    // Lấy thông tin giỏ hàng từ database dựa trên cartId
    const cart = await Cart.findOne({ _id: cartId });
    // Tạo mảng products lưu thông tin các sản phẩm có trong giỏ hàng
    let products = [];
    if(cart){
      for (const product of cart.products) {
        const objectProduct = {
          product_id: product.product_id,
          quantity: product.quantity,
          price: 0,
          discountPercentage: 0
        }
        const productInfo = await Product.findOne({
          _id: product.product_id,
          deleted: false,
          status: "active"
        })
        objectProduct.price = productHelper.priceNewProduct(productInfo);
        objectProduct.discountPercentage = productInfo.discountPercentage;
        products.push(objectProduct);
      }
    }
    const objectOrder = {
      user_id: "",
      cart_id: cartId,
      userInfo: userInfo,
      products: products
    }
    const order = new Order(objectOrder);
    await order.save();
    await Cart.updateOne(
      {
        _id: cartId
      },{
        products: []
      }
    )
    // Sau khi order.save() cap nhat so luong san pham trong kho
    for (const item of products) {
      console.log(item);
      await Product.updateOne(
        { _id: item.product_id },
        { $inc: { stock: -item.quantity } }
      );
    }
    res.redirect(`/checkout/success/${order.id}`);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Có lỗi xảy ra khi đặt hàng");
  }
};

// [GET] /checkout/order/success/:orderId
module.exports.orderSuccess = async (req, res) => {
  try {
    // Lấy id của đơn hàng thông qua params
    const orderId = req.params.orderId;
    // Tìm đơn hàng trong database
    const order = await Order.findOne({ _id: orderId });
    if (!order) {
      return res.status(404).send("Đơn hàng không tồn tại");
    }
    // Tính tổng tiền đơn hàng, tiền cho mỗi mặt hàng
    let totalPriceOrder = 0;
    for (const product of order.products) {
      const productInfo = await Product.findOne({
        _id: product.product_id,
        deleted: false,
        status: "active"
      }).select("title thumbnail");
      product.productInfo = productInfo;
      // Tính tổng tiền của từng sản phẩm trong đơn hàng
      let totalPrice = product.price * product.quantity;
      totalPriceOrder += totalPrice;
      // Gán tổng tiền vào từng sản phẩm để hiển thị ra view
      product.totalPrice = totalPrice;
    }
    // Gán tổng tiền đơn hàng vào order để hiển thị ra view
    order.totalPriceOrder = totalPriceOrder;
    
    res.render("client/pages/checkout/success", {
      pageTitle: "Đặt hàng thành công",
      order: order
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Có lỗi xảy ra khi đặt hàng thành công ");
  }
};