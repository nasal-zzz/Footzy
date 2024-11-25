const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin/adminController')
const adminAuth = require('../middlewares/admin/adminAuth')
const usersController = require('../controllers/admin/usersController')
const categoryController = require('../controllers/admin/categoryController')




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



















module.exports = router;