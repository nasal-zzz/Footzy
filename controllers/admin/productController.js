const productSchema = require('../../models/productSchema');
const categorySchema = require('../../models/categorySchema');
const userSchema = require('../../models/userSchema')

const sharp = require('sharp')

const fs = require('fs')
const path = require('path');
const { Console } = require('console');



const loadProducts = async (req,res) => {
    try {

const search = req.query.search || "";
const page =  req.query.page || 1;
const limit = 3;

const productData = await productSchema.find({

    $or:[
        {productName:{$regex: new RegExp(".*"+search+".*","i")}},
        // {category:{$regex:new RegExp(".*"+search+".*","i")}}
    ],
}).populate('category').sort({createdAt:-1}).limit(limit).skip((page-1)*limit)

const count = await productSchema.find({
    $or:[
        {productName:{$regex:new RegExp(".*"+search+".*","i")}},
        // {category:{$regex:new RegExp(".*"+search+".*","i")}}
    ],
})

// Calculate total stock by iterating through the productData array
const totalStock = productData.reduce((sum, product) => {
    if (product.sizes) {
        // Sum stock for each size within the product
        return sum + product.sizes.reduce((innerSum, sizeObj) => innerSum + sizeObj.stock, 0);
    }
    return sum;
}, 0);



const Category = await categorySchema.find({isListed:true});
const totalPages = Math.ceil(count / limit);


        res.render('products',{
           
            Category,
            totalStock :totalStock,
           product:productData,
           currentPage: page,
           totalPages: totalPages,
           limit: limit,

    })
        
    } catch (error) {
        console.log(error);
        res.redirect("/notFound");

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
            })),          
              status: product.status,
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


const getEditProduct = async (req,res) => {

    try {
        let id = req.query.id
        console.log("iddd..",id);
        
        
    const productData = await productSchema.findOne({_id:id}).populate('category')
    const Categories = await categorySchema.find({isListed:true})
console.log('heyy', productData);

        res.render('editProduct',{
            Categories : Categories,
            product : productData
        })
    } catch (error) {
        console.log(error);
        res.redirect('/admin/notFound')
        
    }
}












module.exports = {
    loadAddProduct,
    loadProducts,
    addProduct,
    getEditProduct
}