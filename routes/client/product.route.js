const express = require("express");
const router = express.Router();

//controller
const controller = require("../../controllers/client/product.controller");

router.get('/', controller.index)

// router.get('/:id', (req, res) => {
//   res.render("client/pages/products/index")
// })
// router.get('/edit', (req, res) => {
//   res.render("client/pages/products/index")
// })
// router.get('/update', (req, res) => {
//   res.render("client/pages/products/index")
// })

module.exports = router;