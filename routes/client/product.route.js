const express = require("express");
const router = express.Router();

//controller
const controller = require("../../controllers/client/product.controller");

router.get('/', controller.index)
// router.get('/:slug', controller.detail)
router.get('/:slugCategory', controller.slugCategory)


module.exports = router;