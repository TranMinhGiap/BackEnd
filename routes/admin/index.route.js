// Định nghĩa ra các route / người xử lý để khi có yêu cầu thì nó sẽ xử lý và trả về phản hồi
const dashboardRouter = require('./dashboard.route');
const productRouter = require('./product.route');
const productCategorRouter = require('./product-category.route');
const roleRouter = require("./role.route");
const accountRouter = require("./account.route");
const authRouter = require("./auth.route");
const systemConfig = require('../../config/system');
const myAccountRouter = require("../admin/my-account.route")
const authMiddleware = require("../../middlewares/admin/auth.middleware");

module.exports = (app) => {
  const pathAdmin = systemConfig.prefixAdmin
  app.use(pathAdmin + '/dashboard', authMiddleware.requireAuth, dashboardRouter)
  //Express tự normalize thành / (không bị //). => giống nó tự gộp
  app.use(pathAdmin + '/products', authMiddleware.requireAuth, productRouter)
  app.use(pathAdmin + '/products-category', authMiddleware.requireAuth, productCategorRouter)
  app.use(pathAdmin + '/roles', authMiddleware.requireAuth, roleRouter)
  app.use(pathAdmin + '/accounts', authMiddleware.requireAuth, accountRouter)
  app.use(pathAdmin + '/my-account', authMiddleware.requireAuth, myAccountRouter)
  app.use(pathAdmin + '/auth',authRouter)
}
