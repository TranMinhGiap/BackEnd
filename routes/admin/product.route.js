const express = require("express");
const router = express.Router();

//controller
const controller = require("../../controllers/admin/product.controller");

router.get('/', controller.index)

module.exports = router;