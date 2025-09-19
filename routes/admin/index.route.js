// Định nghĩa ra các route / người xử lý để khi có yêu cầu thì nó sẽ xử lý và trả về phản hồi
const dashboardRouter = require('./dashboard.route');
const productRouter = require('./product.route');
const productCategorRouter = require('./product-category.route');
const systemConfig = require('../../config/system');

module.exports = (app) => {
  const pathAdmin = systemConfig.prefixAdmin
  app.use(pathAdmin + '/dashboard', dashboardRouter)
  //Express tự normalize thành / (không bị //). => giống nó tự gộp
  app.use(pathAdmin + '/products', productRouter)
  app.use(pathAdmin + '/products-category', productCategorRouter)
}
