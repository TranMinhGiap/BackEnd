const Product = require("../../models/product.modal")

module.exports.index = async (req, res) => {
  let params = {
    deleted: false,
  }
  // xử lý lọc theo trạng thái
  // Button trạng thái
  let filterStatus = [
    {
      name: "Tất cả",
      status: "",
      class: ""
    },
    {
      name: "Hoạt động",
      status: "active",
      class: ""
    },
    {
      name: "Dừng hoạt động",
      status: "inactive",
      class: ""
    },
  ]
  if(req.query.status){
    const index = filterStatus.findIndex(item => item.status === req.query.status);
    filterStatus[index].class = "active"
  }
  else{
    const index = filterStatus.findIndex(item => item.status === "");
    filterStatus[index].class = "active"
  }
  // End button trạng thái
  if(req.query.status){
    params.status = req.query.status;
  }
  // End xử lý lọc theo trạng thái
  // Search
  let keyword = "";
  if(req.query.keyword){
    keyword = req.query.keyword;
    // params.title = keyword; => Tìm kiếm chính xác title = keyword
    const regex = new RegExp(keyword, "i");
    params.title = regex;
    // Chỉ cần title chứa keyword do mongo ho tro tim kiem theo regex
  }
  // End Search
  // Truy vấn database dựa trên điều kiện params + trả kết quả về view hiển thị
  const products = await Product.find(params);
  // console.log(req.query);
  res.render("admin/pages/products/index", {
    pageTitle: "Products Admin",
    products: products,
    filterStatus: filterStatus,
    keyword: keyword
  })
}