const express = require('express')
const router = express.Router();

const userController = require('../controllers/user/userController')


router.get('/',userController.loaduserHome)
router.get('/login',userController.loadUserLogin)
router.get('/signup',userController.userSignUp)
router.post('/signup',userController.SignUp)
router.post('/verify-otp',userController.verifyOTP)

router.get('*',userController.erroPage)


module.exports = router;