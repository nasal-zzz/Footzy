const userSchema = require('../../models/userSchema') // requiring user schema

const productSchema = require('../../models/productSchema')

const categorySchema =  require('../../models/categorySchema')

const cartSchema = require('../../models/cartSchema')

const addressSchema =  require('../../models/addressSchema')

const orderSchema =  require('../../models/orderSchema')


const orderDetails = async (req,res) => {
    try {
        const orderId = req.query.orderId;

        res.render('orderDetails')
        
    } catch (error) {
        
    }
}




module.exports = {
    orderDetails 
}
