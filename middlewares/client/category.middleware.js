const ProductCategory = require("../../models/product-category.modal");
const createTreeHelper = require("../../helpers/createTree");

module.exports.category = async (req, res, next) => {
  const productsCategory = await ProductCategory.find({
    deleted: false, 
    status: "active"
  });

  const newProductsCategory = createTreeHelper.createTree(productsCategory);

  res.locals.layoutProductsCategory = newProductsCategory;
  next();
}