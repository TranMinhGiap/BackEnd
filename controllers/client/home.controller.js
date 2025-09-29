const Product = require("../../models/product.modal");

const productHelper = require("../../helpers/product");

// [GET] /home
module.exports.index = async (req, res) => {
  try {
    const condition = {
      featured: "1",
      deleted: false,
      status: "active"
    }
    const productFeatured = await Product.find(condition).limit(8);
    const newProduct = productHelper.priceNewProducts(productFeatured);
    res.render("client/pages/home/index", {
      pageTitle: "Trang chủ",
      productFeatured: newProduct
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Có lỗi xảy ra khi hiển thị page home");
  }
};
