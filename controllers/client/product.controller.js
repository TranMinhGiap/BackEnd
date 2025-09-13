const Product = require("../../models/product.modal")

module.exports.index = async (req, res) => {

  const products = await Product.find({
    status: "active",
    deleted: false
  });
  console.log(products);

  const newProduct = products.map(item => {
    item.priceNew = (item.price * (1 - item.discountPercentage / 100)).toFixed(2);
    return item;
  })

  // Nên xử lý logic bên controller, logic nho nhỏ ta mới viết bên view (ví dụ: điều kiện render)

  res.render("client/pages/products/index", {
    pageTitle: "Trang sản phẩm",
    products: newProduct
  })
  // Trong view, bạn có thể sử dụng các key của object này. => coi nó là biến cũng được
}
