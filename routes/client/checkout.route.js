const express = require("express");
const router = express.Router();

// import controller
const controller = require("../../controllers/client/checkout.controller")

router.get('/', controller.index)


module.exports = router;