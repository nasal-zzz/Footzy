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
const page = parseInt(req.query.page) || 1;
const limit = 3;
const skip = (page-1)*limit

const productData = await productSchema.find({

    $or:[
        {productName:{$regex: new RegExp(".*"+search+".*","i")}},
        // {category:{$regex:new RegExp(".*"+search+".*","i")}}
    ],
})
.populate('category')
.sort({createdAt:-1})
.skip(skip)
.limit(limit)

const count = await productSchema.find({
    $or:[
        {productName:{$regex:new RegExp(".*"+search+".*","i")}},
        // {category:{$regex:new RegExp(".*"+search+".*","i")}}
    ],
}).countDocuments();

const moment = require('moment');



const Category = await categorySchema.find({isListed:true});
const totalPages = Math.ceil(count / limit);


        res.render('products',{
           
            Category,
           product:productData,
           currentPage: page,
           totalPages: totalPages,
           limit: limit,
           moment

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

        const productExist = await productSchema.find({
            productName: { $regex: new RegExp(`^${product.productName}$`, 'i') }
          });
          
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

        

    

        // const discountedPrice = product.regularPrice * (1 - product.discount / 100);

        


        const images = req.files?.map((file) => file.filename) || [];
       
        const newProduct = new productSchema({
            productName: product.productName,
            description: product.productDescription,
            category: categoryId._id,
            regularPrice: product.regularPrice,
            discount:product.discount,
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


// const editProduct = async (req, res) => {
//     const { id } = req.params;
//     console.log("iddddddddddd..............",id)
//     const product = req.body;

//     console.log('prodd.....',product);
    

//     try {
//         // Validate input data more thoroughly
//         if (!product.productName || !product.description) {
//             return res.status(400).json({ message: 'Product name and description are required' });
//         }

//         if (parseFloat(product.regularPrice) <= 0 || parseFloat(product.salePrice) <= 0) {
//             return res.status(400).json({ message: 'Prices must be positive' });
//         }

//         const categoryId = await categorySchema.findOne({ name: product.category});
//         if (!categoryId) {
//             return res.status(400).json({ message: 'Invalid category' });
//         }
//         console.log("cattttttttttttt..........",categoryId);
        
//         const images = req.files?.map((file) => file.filename) || [];

//         console.log("img..................",images);
        


//         const updatedProduct = await productSchema.findByIdAndUpdate(id, {
//             productName: product.productName,
//             description: product.description,
//             category: categoryId._id,
//             regularPrice: product.regularPrice,
//             salePrice: product.salePrice,
//             sizes: product.sizes.map(size => ({
//                 size: size.size,
//                 stock: size.stock
//             })),
//             status: product.status,
//             productImage: images,
//             isBlocked: product.isBlocked
//         }, { new: true, runValidators: true });

//         if (!updatedProduct) {
//             return res.status(404).json({ message: 'Product not found' });
//         }

//         res.json({ 
//             message: 'Product updated successfully', 
//             product: updatedProduct 
//         });

//     } catch (error) {
//         console.error('Product update error:', error);
//         res.status(500).json({ 
//             message: 'Error updating product', 
//             error: error.message 
//         });
//     }
// };






// const editProduct = async (req, res) => {
//     const { id } = req.params;

//     try {
//         const product = await productSchema.findById(id);
//         console.log('prod.....',product);
        
//         if (!product) return res.status(404).json({ message: 'Product not found' });

//         const { productName, description, regularPrice, salePrice, category, sizes, isBlocked } = req.body;

//         product.productName = productName;
//         product.description = description;
//         product.regularPrice = regularPrice;
//         product.salePrice = salePrice;
//         product.category = category;
//         product.sizes = sizes;
//         product.isBlocked = isBlocked;

//         if (req.files && req.files.length > 0) {
//             const imagePaths = req.files.map(file => file.filename);
//             product.productImage.push(...imagePaths);
//         }

//         await product.save();
//         res.status(200).json({ message: 'Product updated successfully' });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Server error' });
//     }
// };
const editProduct = async (req, res) => {
    try {
      const id = req.params.id;
      console.log('Product ID:', id);
  
      const product = await productSchema.findById(id);
      if (!product) {
        console.error('Product not found!');
        return res.redirect('/notFound');
      }
  
      console.log('Existing Product:', product);
  
      const data = req.body;
      console.log('Incoming Data:', data);

      const sizes = data.sizes;
      const size = data.size;
      const stock = data.stock;

      if(size && stock){

      const newSizes = size.map((s, index) => ({
        size: s,
        stock: stock[index],
      }));
      
      // Push the new sizes into the sizes array
      sizes.push(...newSizes);
      
      console.log('pushedd!!!!!!!!!! zzz',sizes);
    }
  
      // Check if another product exists with the same name
      const existingProduct = await productSchema.findOne({
        productName: data.productName,
        _id: { $ne: id },
      });
      if (existingProduct) {
        console.error('Product name already exists!');
        return res.status(400).json({
          error: 'Product name is already in use, please try another name!',
        });
      }
  
      // Process Images
      let images = data.images || [];
      if (req.files && req.files.length > 0) {
        const newImages = req.files.map((file) => file.filename);
        images = [...images, ...newImages]; // Combine existing and new images
      }
      console.log('Final Images:', images);


  
      // Prepare update fields
      const updateFields = {
        productName: data.productName,
        description: data.productDescription,
        category: data.category,
        regularPrice: data.regularPrice,
        discount:data.discount,
        salePrice: data.salePrice,
        sizes: sizes,
        status: data.status,
        isBlocked: data.isBlocked,
        productImage: images,
      };
  
      console.log('Update Fields:', updateFields);
  
      // Update product
      const updatedProduct = await productSchema.findByIdAndUpdate(
        id,
        updateFields,
        { new: true }
      );
      console.log('Updated Product:', updatedProduct);
  
    //   if (!updatedProduct) {
    //     console.error('Failed to update product!');
    //     return res.redirect('/notFound');
    //   }
  
     return res.redirect('/admin/products');

    } catch (error) {
      console.error('Error on editing product:', error.message);
      res.redirect('/admin/notFound');
    }
  };
  



//   const deleteImage = async (req,res) => {
    
// try {
    
//     const {imageNameToServer,productIdToServer} = req.body;
//     const product = await productSchema.findByIdAndUpdate(productIdToServer,{$pull:{productImage:imageNameToServer}});
//     const imagePath = path.join("public","product-images",imageNameToServer)
//     if(fs.existsSync(imagePath)){
//         await fs.unlinkSync(imagePath);
//         console.log(`image ${imageNameToServer} deleted successfully`);
        
//     }else{
//         console.log(`image ${imageNameToServer} not foung`);
        
//     }

// res.send({status:true});


// } catch (error) {
//     res.redirect('/notFound')
//     console.log('error on deleting imge...!');
    
// }


//   }



const deleteImage = async (req, res) => {
    try {
        const { imageNameToServer, productIdToServer } = req.body;

        // const productimg = productSchema.findOne({_id:productIdToServer})
        // console.log('prod imgs.../',productimg);
        

        // if(productimg.productImage.length <= 2){
        //     return res.status(400).json({
        //         status: false,
        //         message: 'must want 2 images for a product...!'
        //     });
        // }
        
        // Remove the image from the product's image array
        await productSchema.findByIdAndUpdate(productIdToServer, {
            $pull: { productImage: imageNameToServer }
        });

        // Delete the image file
        const imagePath = path.join("public", "uploads", "product-images", imageNameToServer);
        if (fs.existsSync(imagePath)) {
            await fs.promises.unlink(imagePath);
            console.log(`Image ${imageNameToServer} deleted successfully`);
        } else {
            console.log(`Image ${imageNameToServer} not found`);
        }

        // Send a success response
        res.json({ status: true });
    } catch (error) {
        console.error('Error deleting image:', error);
        res.status(500).json({ status: false, message: 'Failed to delete image' });
    }
};


module.exports = {
    loadAddProduct,
    loadProducts,
    addProduct,
    getEditProduct,
    editProduct,
    listProduct,
    unlistProduct,
    deleteImage
}