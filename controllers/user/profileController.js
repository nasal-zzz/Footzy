const userSchema = require('../../models/userSchema') // requiring user schema

const productSchema = require('../../models/productSchema')

const categorySchema =  require('../../models/categorySchema')

const addressSchema =  require('../../models/addressSchema')

const bcrypt = require('bcrypt')


const userAddress = async (req,res) => {
    try {
        
res.render('address')

    } catch (error) {
        
    }
}

const loadOrders = async (req,res) => {
    try {
        
res.render('orders')

    } catch (error) {
        
    }
}

const loadEditInfo = async (req,res) => {
    try {
        const id = req.session.user
        
        console.log("sessn user..../",id);

        
const user = await userSchema.findById(id)
console.log(" user..../infoo",user);

res.render('editInfo',{user:user})

    } catch (error) {
console.log('error',error);
res.redirect('/notFound')
        
    }
}













module.exports = {
    userAddress,
    loadOrders,
    loadEditInfo
}