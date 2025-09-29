const ProductCategory = require("../models/product-category.modal");

module.exports.getSubCategory = async (parentId) => {
  const getSubCategory = async (parentId) => {
    // Lấy các category con trực tiếp của parentId
    const subs = await ProductCategory.find({
      parent_id: parentId,
      status: "active",
      deleted: false,
    });

    // Bắt đầu với mảng chứa chính các category con trực tiếp
    let allSub = [...subs];

    // Đệ quy để lấy tiếp các category con cấp sâu hơn
    for (const sub of subs) {
      const childs = await getSubCategory(sub.id);
      allSub = allSub.concat(childs);
    }

    return allSub;
  }
  const result = await getSubCategory(parentId);
  return result;
}