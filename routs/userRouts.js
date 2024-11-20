const express = require('express')
const router = express.Router();

const userController = require('../controllers/user/userController');
const passport = require('passport');


router.get('/',userController.loaduserHome)
router.get('/login',userController.loadUserLogin)
router.get('/signup',userController.userSignUp)
router.post('/signup',userController.SignUp)
router.post('/verify-otp',userController.verifyOTP)
router.post('/resend-otp',userController.resendOtp);

// google authenticatiom
router.get('/auth/google',passport.authenticate('google',{scope:['profile','email']}));
router.get('/google/callback',passport.authenticate('google',{failureRedirect:'/signup'}),(req,res)=>{
    res.redirect('/')
});

router.get('*',userController.erroPage)


module.exports = router;