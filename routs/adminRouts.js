const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin/adminController')
const adminAuth = require('../middlewares/admin/adminAuth')
const usersController = require('../controllers/admin/usersController')
const categoryController = require('../controllers/admin/categoryController')
const productController = require('../controllers/admin/productController')




router.get('/notFound',adminController.pageError)

router.get('/login',adminController.loadLogin)

router.post('/login',adminController.adminLogin);

router.get('/dashboard',adminAuth.adminAuth,adminController.loadDashboard)

router.get('/logout',adminController.logout)

router.get('/users',adminAuth.adminAuth,usersController.customerInfo)

// block user
router.get('/blockUser',adminAuth.adminAuth,usersController.userBlock)
// unblock user
router.get('/unblockUser',adminAuth.adminAuth,usersController.userunBlock)

//category management
router.get('/categories',adminAuth.adminAuth,categoryController.categoryInfo)

router.get('/addCategory',adminAuth.adminAuth,categoryController.loadAddCategory)
router.post('/addCategory',adminAuth.adminAuth,categoryController.addCategory)

// list/unlist
router.get('/listCategory',adminAuth.adminAuth,categoryController.listCategory)
router.get('/unlistCategory',adminAuth.adminAuth,categoryController.unlistCategory)

// edit category
router.get('/editCategory',adminAuth.adminAuth,categoryController.loadEditCategory)
router.patch('/editCategory/:id',adminAuth.adminAuth,categoryController.editCategory)

// product management
router.get('/products',adminAuth.adminAuth,productController.loadProducts)

router.get('/addProducts',adminAuth.adminAuth,productController.loadAddProduct)
















module.exports = router;