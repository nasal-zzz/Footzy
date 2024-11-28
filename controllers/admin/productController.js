const productSchema = require('../../models/productSchema');
const categorySchema = require('../../models/categorySchema');
const userSchema = require('../../models/userSchema')

const sharp = require('sharp')

const fs = require('fs')
const path = require('path');
const { Console } = require('console');



const loadProducts = async (req,res) => {
    try {
     const productData = await productSchema.find({})


console.log("prooo..",productData);

        res.render('products',{
            product:productData,
        })
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





const addProduct = async (req, res) => {
    try {
        console.log('Request Body:', req.body);

        const product = req.body;

       

        const validStatuses = ["Available", "Sold Out"];
        if (!validStatuses.includes(product.status)) {
            return res.status(400).send("Invalid status value.");
        }

        const categoryId = await categorySchema.findOne({ name: product.category });
        if (!categoryId) {
            return res.status(400).send("Invalid category name.");
        }

        const images = req.files?.map((file) => file.filename) || [];
       
        const newProduct = new productSchema({
            productName: product.productName,
            description: product.productDescription,
            category: categoryId._id,
            regularPrice: product.regularPrice,
            salePrice: product.salePrice,
            sizes: product.sizes.map(size => ({
                size: size.size,
                stock: size.stock
            })),            status: product.status,
            productImage: images,
        });

        await newProduct.save();

        console.log("Product successfully saved:", newProduct);

        return res.redirect('/admin/products');
    } catch (error) {
        console.error("Error saving product:", error);
        return res.redirect('/admin/login');
    }
};















module.exports = {
    loadAddProduct,
    loadProducts,
    addProduct
}