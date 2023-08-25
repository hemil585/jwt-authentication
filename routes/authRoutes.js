const express = require('express')
const router = express.Router()

const authController = require('../controllers/authController')

router
    .get('/signup',authController.signupGet)
    .post('/signup',authController.signupPost)
    .get('/login',authController.loginGet)
    .post('/login',authController.loginPost)
    .get('/logout',authController.logout)


module.exports = router