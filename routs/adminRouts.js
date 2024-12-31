const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin/adminController')
const adminAuth = require('../middlewares/admin/adminAuth')
const usersController = require('../controllers/admin/usersController')
const categoryController = require('../controllers/admin/categoryController')
const productController = require('../controllers/admin/productController')
const orderController = require('../controllers/admin/orderController')
const uploads = require('../config/multer')



router.get('/notFound',adminController.pageError)

router.get('/login',adminController.loadLogin)

router.post('/login',adminController.adminLogin);
     
router.get('/dashboard',adminAuth.isLogin,adminController.loadDashboard)

router.get('/logout',adminController.logout)

router.get('/users',adminAuth.isLogin,usersController.customerInfo)

// block user
router.get('/blockUser',adminAuth.isLogin,usersController.userBlock)
// unblock user
router.get('/unblockUser',adminAuth.isLogin,usersController.userunBlock)

//category management
router.get('/categories',adminAuth.isLogin,categoryController.categoryInfo)

router.get('/addCategory',adminAuth.isLogin,adminAuth.isLogin,categoryController.loadAddCategory)
router.post('/addCategory',adminAuth.isLogin,categoryController.addCategory)

// list/unlist
router.get('/listCategory',adminAuth.isLogin,categoryController.listCategory)
router.get('/unlistCategory',adminAuth.isLogin,categoryController.unlistCategory)

// edit category
router.get('/editCategory',adminAuth.isLogin,categoryController.loadEditCategory)
router.patch('/editCategory/:id',adminAuth.isLogin,categoryController.editCategory)

// product management
router.get('/products',adminAuth.isLogin,productController.loadProducts)

router.get('/addProducts',adminAuth.isLogin,productController.loadAddProduct)
router.post('/addProduct',adminAuth.isLogin,uploads.array("images",3),productController.addProduct)

// edit product 
router.get('/editProduct',adminAuth.isLogin,productController.getEditProduct)
router.post('/editProduct/:id',adminAuth.isLogin,uploads.array("newImages[]"),productController.editProduct)

router.post('/deleteImage',adminAuth.isLogin,productController.deleteImage)


// list/unlist product
router.get('/listProduct',adminAuth.isLogin,productController.listProduct)
router.get('/unlistProduct',adminAuth.isLogin,productController.unlistProduct)

// orders
router.get('/orders',adminAuth.isLogin,orderController.ordersList)
router.get('/orderDetailss',adminAuth.isLogin,orderController.orderDetails)

// update-order-status
router.post('/update-order-status',adminAuth.isLogin,orderController.updateOrderStatus )

















module.exports = router;