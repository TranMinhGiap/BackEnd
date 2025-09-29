// Định nghĩa ra các route / người xử lý để khi có yêu cầu thì nó sẽ xử lý và trả về phản hồi
const productRouter = require('./product.route')
const homeRouter = require('./home.route')

const categoryMiddleware = require("../../middlewares/client/category.middleware");

module.exports = (app) => {
  app.use(categoryMiddleware.category)
  // Tất cả route đều sử dụng middleware này
  app.use('/', homeRouter)
  //Express tự normalize thành / (không bị //). => giống nó tự gộp
  app.use('/products', productRouter)
}
