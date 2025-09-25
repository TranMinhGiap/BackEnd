const express = require('express');
var path = require('path');
const app = express();
require("dotenv").config();
const port = process.env.PORT;
const methodOverride = require('method-override')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

const systemConfig = require('./config/system');

const database = require('./config/database')

// Override Method
app.use(methodOverride('_method'))
// End Override Method

// Giúp BE lấy được dữ liệu từ body khi gửi form bằng phương thức != GET
app.use(bodyParser.urlencoded())
// parse application/x-www-form-urlencoded

// Giúp BE phân tích cookie trong req của client gửi lên
app.use(cookieParser())

// Tiny MCE
app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));
// End Tiny MCE

//============== database =============
database.connect();
//============== end database =============

const route = require("./routes/client/index.route");
const routeAdmin = require("./routes/admin/index.route");

// =============== PUG ================
app.set('view engine', 'pug');
app.set('views', `${__dirname}/views`)
// =============== END PUG ================

// static file
app.use(express.static(`${__dirname}/public`))
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