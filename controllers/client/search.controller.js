const Product = require("../../models/product.modal");

const productHelper = require("../../helpers/product");
const searchHelper = require("../../helpers/search");
// [GET] /search
module.exports.index = async (req, res) => {
  try {
    const condition = {
      deleted: false,
      status: "active"
    }
    // search
    const objectSearch = searchHelper(req.query);
    if(objectSearch.regex){
      condition.title = objectSearch.regex;
    }
    // End search
    const products = await Product.find(condition);
    const newProduct = productHelper.priceNewProducts(products);
    res.render("client/pages/search/index", {
      pageTitle: "Kết quả tìm kiếm",
      keyword: objectSearch.keyword,
      products: newProduct
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Có lỗi xảy ra khi hiển thị page home");
  }
};