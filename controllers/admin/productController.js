const productSchema = require('../../models/productSchema');
const categorySchema = require('../../models/categorySchema');
const userSchema = require('../../models/userSchema')

const sharp = require('sharp')

const fs = require('fs')
const path = require('path')



const loadProducts = async (req,res) => {
    try {
        res.render('products')
    } catch (error) {
        console.log(error);
        
    }
}


const loadAddProduct = async (req,res) => {
    try {
        const category = await categorySchema.find({isListed:true});
        
        res.render('addProduct',{
            category:category
        })
    } catch (error) {
        console.log(error);
        res.redirect('/admin/notFound')
        
    }
}


















module.exports = {
    loadAddProduct,
    loadProducts
}