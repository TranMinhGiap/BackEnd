const express = require("express");
const router = express.Router();

// Image
const multer  = require('multer');
const upload = multer();
const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware")
// Image

// Validate
const validate = require("../../middlewares/admin/account.middleware")
// Validate

//controller
const controller = require("../../controllers/admin/account.controller");
//controller

router.get('/', controller.index)
router.get('/create', controller.create)
router.post(
  '/create',
  upload.single('avatar'),
  uploadCloud.upload,
  validate.createPost,
  controller.createPost)
router.get('/edit/:id', controller.edit)
router.patch(
  '/edit/:id',
  upload.single('avatar'),
  uploadCloud.upload,
  validate.editPatch,
  controller.editPatch)
router.get('/detail/:id', controller.detail)
router.delete('/delete/:id', controller.delete)
module.exports = router;