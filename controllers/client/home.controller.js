const Product = require("../../models/product.modal");

const productHelper = require("../../helpers/product");

// [GET] /home
module.exports.index = async (req, res) => {
  try {
    // Sản phẩm nổi bật
    const productsFeatured = await Product.find({
      featured: "1",
      deleted: false,
      status: "active"
    }).limit(8);
    const newProductsFeatured = productHelper.priceNewProducts(productsFeatured);
    // End Sản phẩm nổi bật
    // Sản phẩm mới nhất
    const productsNew = await Product.find({
      deleted: false,
      status: "active"
    }).limit(8).sort({ position: "desc" });
    const newProductsNew = productHelper.priceNewProducts(productsNew);
    // End Sản phẩm mới nhất
    res.render("client/pages/home/index", {
      pageTitle: "Trang chủ",
      productsFeatured: newProductsFeatured,
      productsNew: newProductsNew
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Có lỗi xảy ra khi hiển thị page home");
  }
};
