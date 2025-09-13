const Product = require("../../models/product.modal")

module.exports.index = async (req, res) => {
  const products = await Product.find({
    deleted: false
  });
  console.log(products);
  res.render("admin/pages/products/index", {
    pageTitle: "Products Admin",
    products: products
  })
}