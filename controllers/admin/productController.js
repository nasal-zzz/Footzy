const productSchema = require('../../models/productSchema');
const categorySchema = require('../../models/categorySchema');
const userSchema = require('../../models/userSchema')

const sharp = require('sharp')

const fs = require('fs')
const path = require('path');
const { Console } = require('console');
const { render } = require('ejs');



const loadProducts = async (req,res) => {

if(req.session.admin){



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




const Category = await categorySchema.find({isListed:true});
const totalPages = Math.ceil(count / limit);


        res.render('products',{
           
            Category,
           product:productData,
           currentPage: page,
           totalPages: totalPages,
           limit: limit,

    })
        
    } catch (error) {
        console.log(error);
        res.redirect("/notFound");

    }

}else{
    render('adminLogin')
}
}


const loadAddProduct = async (req,res) => {
    try {
        const category = await categorySchema.find({isListed:true});
        console.log("catgtr....",category);
        

        res.render('addProduct',{
            category:category,
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

        const productExist = await productSchema.find({productName:product.productName})
        console.log("exist....!",productExist);
        console.log("exist...length.....!",productExist.length);
        

       if(productExist.length === 0){
        

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

    }else{
        console.log("product already exist on this name...!")
        const category = await categorySchema.find({isListed:true});

          return res.render('addProduct',{
            error:'product already exist on this name...!', 
            category:category,

        });
        }


    } catch (error) {
        console.error("Error saving product:", error);
        return res.redirect('/admin/products');
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
            product : productData,
            error
        })
    } catch (error) {
        console.log(error);
        res.redirect('/admin/notFound')
        
    }
}


// list Product
const listProduct = async (req,res) => {
    try {
        let id = req.query.id;
        console.log("id list..........",id);
        
        await productSchema.updateOne({_id:id},{$set:{isBlocked:false}})
        res.redirect('/admin/products');
    } catch (error) {
        console.log('product listing failed',error);
        res.redirect('/admin/notFound')
        
    }
}


// unlist Product
const unlistProduct = async (req,res) => {
    try {
        let id = req.query.id    
        await productSchema.updateOne({_id:id},{$set:{isBlocked:true}})
        res.redirect('/admin/products');

        
    } catch (error) {
        console.log('product unlisting failed',error);
        res.redirect('/admin/notFound')
    }
}













// const editProduct = async (req,res) => {

//     const {id} = req.params;
//     // const {productName,productDescription,regularPrice,salePrice,status,category,images} = req.body;
//     const product = req.body;
    

// try {
    
// // const product = await productSchema.findByIdAndUpdate(id,{

// // })


// console.log('Request Body:', req.body);




// const validStatuses = ["Available", "Sold Out"];
// if (!validStatuses.includes(product.status)) {
//     return res.status(400).send("Invalid status value.");
// }

// const categoryId = await categorySchema.findOne({ name: product.category });
// if (!categoryId) {
//     return res.status(400).send("Invalid category name.");
// }

// const images = req.files?.map((file) => file.filename) || [];

// const updatedproduct = await productSchema.findByIdAndUpdate(id,{
//     productName: product.productName,
//     description: product.productDescription,
//     category: categoryId._id,
//     regularPrice: product.regularPrice,
//     salePrice: product.salePrice,
//     sizes: product.sizes.map(size => ({
//         size: size.size,
//         stock: size.stock
//     })),          
//       status: product.status,
//     productImage: images,
// },{new:true});


// if(!updatedproduct){
//     return res.status(404).json({ message: 'product not found' });

// }

// res.json({ message: 'Product updated successfully', updatedproduct });


// } catch (error) {
    
//     return res.status(404).json({ message: 'Product already exist with this name...!' });

 
// }


// }


const editProduct = async (req, res) => {
    const { id } = req.params;
    console.log("iddddddddddd..............",id)
    const product = req.body;

    console.log('prodd.....',product);
    

    try {
        // Validate input data more thoroughly
        if (!product.productName || !product.description) {
            return res.status(400).json({ message: 'Product name and description are required' });
        }

        if (parseFloat(product.regularPrice) <= 0 || parseFloat(product.salePrice) <= 0) {
            return res.status(400).json({ message: 'Prices must be positive' });
        }

        const categoryId = await categorySchema.findOne({ name: product.category});
        if (!categoryId) {
            return res.status(400).json({ message: 'Invalid category' });
        }
        console.log("cattttttttttttt..........",categoryId);
        
        const images = req.files?.map((file) => file.filename) || [];

        console.log("img..................",images);
        


        const updatedProduct = await productSchema.findByIdAndUpdate(id, {
            productName: product.productName,
            description: product.description,
            category: categoryId._id,
            regularPrice: product.regularPrice,
            salePrice: product.salePrice,
            sizes: product.sizes.map(size => ({
                size: size.size,
                stock: size.stock
            })),
            status: product.status,
            productImage: images
        }, { new: true, runValidators: true });

        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json({ 
            message: 'Product updated successfully', 
            product: updatedProduct 
        });

    } catch (error) {
        console.error('Product update error:', error);
        res.status(500).json({ 
            message: 'Error updating product', 
            error: error.message 
        });
    }
};









module.exports = {
    loadAddProduct,
    loadProducts,
    addProduct,
    getEditProduct,
    editProduct,
    listProduct,
    unlistProduct
}