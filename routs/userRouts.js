const express = require('express')
const router = express.Router();
const userAuth = require('../middlewares/user/userAuth')
const userController = require('../controllers/user/userController');
const productDetailsController = require('../controllers/user/productDetailsController');
const passport = require('passport');


router.get('/',userController.loaduserHome)
router.get('/login',userController.loadUserLogin)
router.post('/login',userController.userLogin)
router.get('/signup',userAuth.isLogin,userController.userSignUp)
router.post('/signup',userController.SignUp)
router.post('/verify-otp',userController.verifyOTP)
router.post('/resend-otp',userController.resendOtp);




// //google authenticatiom
router.get('/auth/google',passport.authenticate('google',{scope:['profile','email']}));
router.get('/google/callback',passport.authenticate('google',{failureRedirect:'/login?error=Your account is blocked'}),(req,res)=>{
    req.session.user = req.user._id;
    res.redirect('/')
});



//profile 
router.get('/userProfile',userAuth.checkSession,userController.userProfile)

// logout
router.get('/logout',userAuth.checkSession,userController.logout)

 router.get('/notFound',userController.erroPage)

//get shop page
router.get('/shop',userController.loadShopePage)


// product details page 
router.get('/productDetails',userAuth.userAuth,userAuth.checkSession,productDetailsController.getDetails)


module.exports = router;