const Product = require("../../models/product.modal");
const ProductCategory = require("../../models/product-category.modal");

const productHelper = require("../../helpers/product");
const ProductCategoryHelper = require("../../helpers/product-category");

// [GET] /product
module.exports.index = async (req, res) => {
  try {
    const products = await Product.find({
      status: "active",
      deleted: false
    }).sort({ position: "desc" });

    const newProduct = productHelper.priceNewProducts(products);

    // Nên xử lý logic bên controller, logic nho nhỏ ta mới viết bên view (ví dụ: điều kiện render)

    res.render("client/pages/products/index", {
      pageTitle: "Trang sản phẩm",
      products: newProduct
    })
    // Trong view, bạn có thể sử dụng các key của object này. => coi nó là biến cũng được
  } catch (error) {
    console.error(error);
    return res.status(500).send("Có lỗi xảy ra khi hiển thị trang chủ client");
  }
}
// [GET] /product/:slug
module.exports.detail = async (req, res) => {
  try {
    const find = {
      deleted: false,
      slug: req.params.slug,
      status: "active"
    };
    const product = await Product.findOne(find);
    res.render("client/pages/products/detail", {
      pageTitle: product.slug,
      product: product
    })
  } catch (error) {
    console.error(error);
    return res.status(500).send("Có lỗi xảy ra khi xem chi tiết sản phẩm");
  }
}
// [GET] /product/:slugCategory
module.exports.slugCategory = async (req, res) => {
  try {
    const slugCategory = req.params.slugCategory;
    const categoryProduct = await ProductCategory.findOne({
      slug: slugCategory,
      deleted: false,
      status: "active"
    });

    const listSubCategory = await ProductCategoryHelper.getSubCategory(categoryProduct.id);
    const ListSubCategoryId = listSubCategory.map(item => item.id);
    const products = await Product.find({
      product_category_id: { $in: [categoryProduct.id, ...ListSubCategoryId] },
      status: "active",
      deleted: false
    }).sort({ position: "desc" });
    const newProducts = productHelper.priceNewProducts(products);
    res.render("client/pages/products/index", {
      pageTitle: categoryProduct.title,
      products: newProducts
    })
  } catch (error) {
    console.error(error);
    return res.status(500).send("Có lỗi xảy ra khi xem chi tiết sản phẩm");
  }
}
