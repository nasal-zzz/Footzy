const userSchema = require('../../models/userSchema') // requiring user schema

const productSchema = require('../../models/productSchema')

const categorySchema =  require('../../models/categorySchema')

const cartSchema = require('../../models/cartSchema')

const addressSchema =  require('../../models/addressSchema')

const orderSchema =  require('../../models/orderSchema')

const walletSchema =  require('../../models/walletSchema')

const wishlistSchema =  require('../../models/wishlistSchema')



const loadWIshlist = async (req,res) => {
    
try {
    
const userId = req.session.user;

const wishlist = await wishlistSchema.findOne({userId:userId})


console.log(wishlist,'wishh');
// console.log('wishlist itms',wishlist.items);

console.log('hloiiii');


if(!wishlist){
  res.render('wishlist',{
    suser:req.session.user,
    title:'Wishlist',
    items: 0,
 })

}else{


 res.render('wishlist',{
    suser:req.session.user,
    title:'Wishlist',
    items:wishlist.items,
 })
}

} catch (error) {
    
}


}

const addToWishlist = async (req,res) => {

try {

    const userId = req.session.user;
    const { productId, size, qty } = req.body;

    console.log('User:', userId, 'Product:', productId, 'Body:', req.body);

    // Fetch user and product details
    const user = await userSchema.findById(userId);
    const product = await productSchema.findById(productId);

    if (!user || !product) {
      console.log('User or Product not found');
      return res.redirect('/notFound');
    }

    const selectedSize = product.sizes.find(s => s.size === size);
    console.log('Selected Size:', selectedSize);


    let wishlist = await wishlistSchema.findOne({ userId });


    if (!wishlist) {
        wishlist = new wishlistSchema({
          userId,
          items: [{
            productId,
            productName:product.productName,
            productImage:product.productImage[0],
            size,
            quantity: qty,
            price: product.salePrice,
          }],
        });
      } else {

        const item = wishlist.items.find(item => item.productId.toString() === productId && item.size === size);
        if (!item) {
          wishlist.items.push({
            productId,
            productName:product.productName,
            productImage:product.productImage[0],
            size,
            quantity: qty,
            price: product.salePrice,
          });
        } else {
            console.log('item already exist on wishlist');
            
          return res.redirect(`/productDetails?id=${productId}`)
        }
      }
    
      await wishlist.save();
      console.log('Cart updated:', wishlist);
  
      res.redirect(`/productDetails?id=${productId}`);

    
} catch (error) {
    res.redirect('/notFound');

    console.error('Error adding to wishlist:', error);
    
}


}




const wishListToCart = async (req, res) => {
  try {
    const userId = req.session.user;
    const { productId, size, qty } = req.body;

    console.log('User:', userId, 'Product:', productId, 'Body:', req.body);

    if (!productId || !size || !qty) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: productId, size, and qty are mandatory.',
      });
    }

    // Fetch user and product details
    const user = await userSchema.findById(userId);
    const product = await productSchema.findById(productId);

    if (!user || !product) {
      return res.status(400).json({
        success: false,
        message: 'User or Product not found.',
      });
    }

    // Check if the selected size exists in the product
    const selectedSize = product.sizes.find(s => s.size === size);

    if (!selectedSize || selectedSize.stock < qty) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient stock for the selected size. Please decrease the quantity or choose a different size.',
      });
    }

    const totalPrice = product.salePrice * qty;
    let cart = await cartSchema.findOne({ userId });

    if (!cart) {
      cart = new cartSchema({
        userId,
        items: [{
          productId,
          productName: product.productName,
          productImage: product.productImage[0],
          size,
          quantity: qty,
          price: product.salePrice,
          totalPrice,
        }],
        finalPrice: totalPrice,
      });
    } else {
      const item = cart.items.find(item => item.productId.toString() === productId && item.size === size);
      if (!item) {
        cart.items.push({
          productId,
          productName: product.productName,
          productImage: product.productImage[0],
          size,
          quantity: qty,
          price: product.salePrice,
          totalPrice,
        });
      } else {
        if (Number(item.quantity) + Number(qty) > product.maxQuantity) {
          return res.status(400).json({
            success: false,
            message: 'You have reached the limit for purchasing this product.',
          });
        } else if (Number(item.quantity) + Number(qty) > selectedSize.stock) {
          return res.status(400).json({
            success: false,
            message: 'Insufficient stock for the selected size. Please decrease the quantity or choose a different size.',
          });
        }
        item.quantity += Number(qty);
        item.totalPrice = item.quantity * product.salePrice;
      }

      cart.finalPrice = cart.items.reduce((sum, item) => sum + item.totalPrice, 0);
    }

    await cart.save();

    await wishlistSchema.updateOne(
      { userId },
      { $pull: { items: { productId, size } } } // Remove the specific item from the wishlist
  );

    return res.status(200).json({
      success: true,
      message: 'Item successfully added to cart!',
      cart,
    });
  } catch (error) {
    console.error('Error adding to cart:', error);
    return res.status(500).json({
      success: false,
      message: 'An unexpected error occurred. Please try again later.',
      error: error.message,
    });
  }
};



const removeWishlisttProduct = async (req,res) => {

  console.log('reeeeeeeeeeeeeeeeeeeechhhhhhhhhhhhhhh!!!!!!!!!!!!!!!!!!!!!!!!!');
  

  try {
    const itemId = req.query.itemId;
    const userId = req.user.id;

    console.log('itmid=',itemId);
    

    // Check if item exists in wishlist
    const wishlist = await wishlistSchema.findOne({userId});

    if (!wishlist) {
        return res.status(404).json({
            success: false,
            message: 'Not found the wishlist..!'
        });
    }

    console.log('jjj==',wishlist.items);
    

    const item = wishlist.items.find(item => item._id.toString() === itemId);
    if (!item) {

      return res.status(404).json({
        success: false,
        message: 'Item not found in your wishlist'
    });    
  }

  

    await wishlistSchema.updateOne(
      { userId },
      {
        $pull: { items: { _id: itemId } },
      }
    );

    // Return success response
    return res.status(200).json({
        success: true,
        message: 'Item successfully removed from wishlist'
    });

} catch (error) {

  console.error(error);
  res.status(500).json({success: false,
    message: 'Failed to remove the product.'
   });

}
  
}




module.exports = {
    loadWIshlist,
    addToWishlist,
    wishListToCart,
    removeWishlisttProduct
}

