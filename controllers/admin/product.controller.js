const Product = require("../../models/product.modal")

module.exports.index = async (req, res) => {
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
  let params = {
    deleted: false,
  }
  if(req.query.status){
    params.status = req.query.status;
  }
  const products = await Product.find(params);
  console.log(products);
  res.render("admin/pages/products/index", {
    pageTitle: "Products Admin",
    products: products,
    filterStatus: filterStatus
  })
}