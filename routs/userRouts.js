const express = require('express')
const router = express.Router();
const userAuth = require('../middlewares/user/userAuth')
const userController = require('../controllers/user/userController');
const productDetailsController = require('../controllers/user/productDetailsController');
const profileController = require('../controllers/user/profileController');
const cartController  = require('../controllers/user/cartController');
const passport = require('passport');


router.get('/',userController.loaduserHome)
router.get('/login',userController.loadUserLogin)
router.post('/login',userController.userLogin)
router.get('/signup',userAuth.isLogin,userController.userSignUp)
router.post('/signup',userController.SignUp)
router.post('/verify-otp',userController.verifyOTP)
router.post('/resend-otp',userController.resendOtp);

// forgot password
router.get('/forgotPassword-verifyEmail',userController.getVerifyEmail)

router.post('/forgotPassword-verifyEmail',userController.verifyEmail)

router.post('/verifyForgot-otp',userController.verifyForgotOTP)
router.post('/resendForgot-otp',userController.resendForgotOtp);

// reset password
router.get('/reset-password',userController.loadResetPassword)
router.post('/reset-password',userController.resetPassword)


// //google authenticatiom
router.get('/auth/google',passport.authenticate('google',{scope:['profile','email']}));
router.get('/google/callback',passport.authenticate('google',{failureRedirect:'/login?error=Your account is blocked'}),(req,res)=>{
    req.session.user = req.user._id;
    res.redirect('/')
});



// logout
router.get('/logout',userAuth.checkSession,userController.logout)

 router.get('/notFound',userController.erroPage)

//get shop page
router.get('/shop',userController.loadShopePage)


// product details page 
router.get('/productDetails',userAuth.checkSession,userAuth.userAuth,productDetailsController.getDetails)


//profile 
router.get('/userProfile',userAuth.checkSession,userController.userProfile)
router.get('/editInfo',userAuth.checkSession,profileController.loadEditInfo)
router.post('/updateProfile',userAuth.checkSession,profileController.editInfo)


// address
router.get('/address',userAuth.checkSession,profileController.userAddress)
router.post('/addAddress',userAuth.checkSession,profileController.addAddress)

//edit address
router.get('/editAddress',userAuth.checkSession,profileController.getEditAddress)
router.post('/editAddress',userAuth.checkSession,profileController.editAddress)
//dlt address
router.get('/deleteAddress',userAuth.checkSession,profileController.dltAddress)
// set as default address 
router.get('/setDefaultAddress',userAuth.checkSession,profileController.setDefaultAddress)


// cart 
router.get('/cart',userAuth.checkSession,cartController.loadCart)
router.post('/addToCart',userAuth.checkSession,cartController.addToCart)
router.delete('/removeCartProduct',userAuth.checkSession,cartController.removeCartProduct)

router.post('/cartQuantityIncrease',userAuth.checkSession,cartController.incraseQuantity)
router.post('/cartQuantityDecrease',userAuth.checkSession,cartController.decreaseQuantity)


// orders
router.get('/orders',userAuth.checkSession,profileController.loadOrders)





module.exports = router;