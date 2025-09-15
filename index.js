const express = require('express');
const app = express();
require("dotenv").config();
const port = process.env.PORT;
var methodOverride = require('method-override')

const systemConfig = require('./config/system');

const database = require('./config/database')

// Override Method
app.use(methodOverride('_method'))
// End Override Method

//============== database =============
database.connect();
//============== end database =============

const route = require("./routes/client/index.route");
const routeAdmin = require("./routes/admin/index.route");

// =============== PUG ================
app.set('view engine', 'pug');
app.set('views', './views')
// =============== END PUG ================

// static file
app.use(express.static("public"))
// end static file

// App local variable (Địng nghĩa biến toàn cụ nhằm sử dụng trong file pug nếu không muốn truyền qua controller)
app.locals.prefixAdmin = systemConfig.prefixAdmin;
// App local variable

// ============= routes ==============
routeAdmin(app)
route(app)
// ============= end routes ==============

// ============ START SERVER ============
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})