const express = require("express");
const router = express.Router();

//controller
const controller = require("../../controllers/client/user.controller");
const validate = require("../../validates/client/user.validate");

router.get('/register', controller.register)
router.get('/login', controller.login)
router.get('/logout', controller.logout)
router.post('/register', validate.registerPost, controller.registerPost)
router.post('/login', validate.loginPost, controller.loginPost)
router.get('/password/forgot', controller.forgotPassword)
router.post('/password/forgot', validate.forgotPasswordPost, controller.forgotPasswordPost)
router.get('/password/otp/', controller.otpPassword)
router.post('/password/otp/', controller.otpPasswordPost)

module.exports = router;