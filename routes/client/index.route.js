// Định nghĩa ra các route / người xử lý để khi có yêu cầu thì nó sẽ xử lý và trả về phản hồi
const productRouter = require('./product.route')
const homeRouter = require('./home.route')

module.exports = (app) => {
  app.use('/', homeRouter)
  //Express tự normalize thành / (không bị //). => giống nó tự gộp
  app.use('/products', productRouter)
}
