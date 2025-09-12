const express = require("express");
const router = express.Router();
// Router() dùng để tạo các router con mục đích là để nối thêm tiền tố vào trước giúp đỡ lặp code cũng như tổ chức router tốt hơn

// import controller
const controller = require("../../controllers/client/home.controller")

router.get('/', controller.index)


module.exports = router;