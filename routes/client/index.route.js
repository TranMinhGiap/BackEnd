// Định nghĩa ra các route / người xử lý để khi có yêu cầu thì nó sẽ xử lý và trả về phản hồi
const productRouter = require('./product.route')
const homeRouter = require('./home.route')
const searchRouter = require('./search.route')
const cartRouter = require("./cart.route");
const checkoutRouter = require("./checkout.route");
const userRouter = require("./user.route");

const categoryMiddleware = require("../../middlewares/client/category.middleware");
const cartMiddleware = require("../../middlewares/client/cart.middleware");
const userMiddleware = require("../../middlewares/client/user.middleware");
const settingMiddleware = require("../../middlewares/client/setting.middleware");

module.exports = (app) => {
  app.use(categoryMiddleware.category)
  app.use(cartMiddleware.cartId)
  app.use(userMiddleware.infoUser)
  app.use(settingMiddleware.settingGeneral)
  // Tất cả route đều sử dụng middleware này
  app.use('/', homeRouter)
  //Express tự normalize thành / (không bị //). => giống nó tự gộp
  app.use('/products', productRouter)
  app.use('/search', searchRouter)
  app.use('/cart', cartRouter)
  app.use('/checkout', checkoutRouter)
  app.use('/user', userRouter)
}
