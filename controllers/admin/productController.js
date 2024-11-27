const productSchema = require('../../models/productSchema');
const categorySchema = require('../../models/categorySchema');
const userSchema = require('../../models/userSchema')

const sharp = require('sharp')

const fs = require('fs')
const path = require('path');
const { Console } = require('console');



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



// const addProduct = async (req,res) => {
//     try {
        
//         const product = req.body;

//         Console.log('body.......!',req.body)
//         const productExist = await productSchema.findOne({
//             productName : product.productName
//         })

//         if(!productExist){
//             const images = [];
//             console.log("fileees",req.files)
//             if(req.files && req.files.length > 0){
//                 for(let i=0;i<req.files.length;i++){

//                     console.log("inner.forloop........1");
                    
//                     let originalImagePath = req.files[i].path;


//                     const resizedImagePath = path.join('public','uploads','product-images',req.files[i].filename);
//                     console.log(resizedImagePath,'resize')
//                     await sharp(originalImagePath).resize({width:200,height:100}).toFile(resizedImagePath);
//                   console.log('hello..........................?');

//                   console.log("nameeeeeeeeeee.......!",req.files[i].filename);
                  
                  
//                     images.push(req.files[i].filename);

//                 }
//             }
//  console.log(images,'image,..............')
//             const categoryId = await categorySchema.findOne({name:product.category});
            
//             if(!categoryId){
//                 return res.status(400).join("invalid category namre..!")
//             }
//             console.log("cat..",categoryId);
            

//             const newProduct = new productSchema({
//                 productName:product.productName,
//                 description:product.description,
//                 category:categoryId._id,
//                 regularPrice:product.regularPrice,
//                 salePrice:product.salePrice,
//                 createdAt: new Date(),
//                 stock:product.stock,
//                 status:product.status,
//                 productImage:images,

//             })
            

//             await newProduct.save();
//             console.log("...........successss");
//             console.log("neeww prod",newProduct);


//             return res.redirect('/admin/products')
            
//         }else{
//             return res.status(400).join('Product already exist ....! please try again with another name...!')
//         }

//     } catch (error) {
//         console.error("Error sasving product...!");
//         return res.redirect('/admin/login')
        
//     }
// }

// const addProduct = async (req, res) => {
//     try {
//         const product = req.body;
//         console.log("Request Body:", product);

//         const productExist = await productSchema.findOne({
//             productName: product.productName,
//         });

//         if (!productExist) {
//             const images = [];
//             console.log("Files received:", req.files);

//             if (req.files && req.files.length > 0) {
//                 for (let i = 0; i < req.files.length; i++) {
//                     const originalImagePath = req.files[i].path; // Path of the uploaded file
//                     const resizedImagePath = path.join(
//                         'public',
//                         'uploads',
//                         'product-images',
//                         `resized-${req.files[i].filename}` // Add a prefix to distinguish resized files
//                     );
            
//                     console.log("Original Image Path:", originalImagePath);
//                     console.log("Resized Image Path:", resizedImagePath);
            
//                     await sharp(originalImagePath)
//                         .resize({ width: 200, height: 100 })
//                         .toFile(resizedImagePath);
            
//                     images.push(`resized-${req.files[i].filename}`); // Save only the resized filename
//                 }
//             }
            
//             console.log("Resized Images:", images);

//             const categoryId = await categorySchema.findOne({ name: product.category });
//             if (!categoryId) {
//                 console.error("Invalid category name:", product.category);
//                 return res.status(400).send("Invalid category name!");
//             }

//             console.log("Category found:", categoryId);

//             const newProduct = new productSchema({
//                 productName: product.productName,
//                 description: product.description,
//                 category: categoryId._id,
//                 regularPrice: product.regularPrice,
//                 salePrice: product.salePrice,
//                 stock: product.stock,
//                 status: product.status,
//                 productImage: images,
//                 createdAt: new Date(),
//             });

//             console.log("Product to save:", newProduct);

//             await newProduct.save();

//             console.log("Product saved successfully:", newProduct);
//             return res.redirect('/admin/products');
//         } else {
//             console.log("Product already exists:", product.productName);
//             return res.status(400).send("Product already exists. Please try another name.");
//         }
//     } catch (error) {
//         console.error("Error saving product:", error);
//         return res.status(500).send("An error occurred while saving the product.");
//     }
// };


const addProduct = async (req, res) => {
    try {
        console.log('Request Body:', req.body);

        const product = req.body;

        const stock = parseInt(product.stock, 10);
        if (isNaN(stock)) {
            return res.status(400).send("Invalid stock value.");
        }

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
            stock,
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















module.exports = {
    loadAddProduct,
    loadProducts,
    addProduct
}