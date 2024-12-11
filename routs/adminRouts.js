const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin/adminController')
const adminAuth = require('../middlewares/admin/adminAuth')
const usersController = require('../controllers/admin/usersController')
const categoryController = require('../controllers/admin/categoryController')
const productController = require('../controllers/admin/productController')
const uploads = require('../config/multer')



router.get('/notFound',adminController.pageError)

router.get('/login',adminController.loadLogin)

router.post('/login',adminController.adminLogin);
     
router.get('/dashboard',adminAuth.adminAuth,adminAuth.isLogin,adminController.loadDashboard)

router.get('/logout',adminController.logout)

router.get('/users',adminAuth.adminAuth,adminAuth.isLogin,usersController.customerInfo)

// block user
router.get('/blockUser',adminAuth.adminAuth,usersController.userBlock)
// unblock user
router.get('/unblockUser',adminAuth.adminAuth,usersController.userunBlock)

//category management
router.get('/categories',adminAuth.adminAuth,adminAuth.isLogin,categoryController.categoryInfo)

router.get('/addCategory',adminAuth.adminAuth,adminAuth.isLogin,categoryController.loadAddCategory)
router.post('/addCategory',adminAuth.adminAuth,categoryController.addCategory)

// list/unlist
router.get('/listCategory',adminAuth.adminAuth,categoryController.listCategory)
router.get('/unlistCategory',adminAuth.adminAuth,categoryController.unlistCategory)

// edit category
router.get('/editCategory',adminAuth.adminAuth,adminAuth.isLogin,categoryController.loadEditCategory)
router.patch('/editCategory/:id',adminAuth.adminAuth,categoryController.editCategory)

// product management
router.get('/products',adminAuth.adminAuth,adminAuth.isLogin,productController.loadProducts)

router.get('/addProducts',adminAuth.adminAuth,adminAuth.isLogin,productController.loadAddProduct)
router.post('/addProduct',adminAuth.adminAuth,uploads.array("images",3),productController.addProduct)

// edit product 
router.get('/editProduct',adminAuth.adminAuth,adminAuth.isLogin,productController.getEditProduct)
router.post('/editProduct/:id',adminAuth.adminAuth,uploads.array("newImages[]"),productController.editProduct)

router.post('/deleteImage',adminAuth.adminAuth,productController.deleteImage)


// list/unlist product
router.get('/listProduct',adminAuth.adminAuth,productController.listProduct)
router.get('/unlistProduct',adminAuth.adminAuth,productController.unlistProduct)













module.exports = router;