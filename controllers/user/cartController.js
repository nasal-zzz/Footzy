const userSchema = require('../../models/userSchema') // requiring user schema

const productSchema = require('../../models/productSchema')

const categorySchema =  require('../../models/categorySchema')

const cartSchema = require('../../models/cartSchema')



const loadCart = async (req,res) => {
  
try {
  const userId = req.session.user;
  const Usercart = await cartSchema.findOne({userId}).populate('items.productId')
  console.log('itttms',Usercart);

  let finalPrice = Usercart.finalPrice;
  console.log('final../',finalPrice);
  
//   const cartItems = Usercart.items.map(item => ({
//     productId: item.productId._id,
//     name: item.productId.productName,
//     price: item.productId.productName,
//     image: item.productId.productImage,
//     description: item.productId.description,
//     quantity: item.quantity,
//     totalPrice: item.totalPrice
// }));

const cartItems = await Promise.all(
  Usercart.items.map(async (item)=>{
    const product = await productSchema.findById(item.productId).select('productName salePrice productImage description maxQuantity ');
console.log('prdct===',product);




if(!product){
  console.error(`Product not found for ID: ${item.productId}`);
  
}
// console.log('itemmss../',iteme);

return {
  productId: product._id,
  name: product.productName,
  price: product.salePrice,
  image: product.productImage[0],
  description: product.description,
  quantity: item.quantity,
  totalPrice: item.totalPrice,
  size:item.size,
  id:item._id,
  maxQuantity:product.maxQuantity
};

  })
)

console.log('passings==',cartItems);

res.render('cart',{
 item:cartItems,
 title:'Cart',
 subTotal : finalPrice,
 suser:userId
})
  
  
} catch (error) {
  console.error('Error adding to cart:', error);
  res.redirect('/notFound');
}

}




const addToCart = async (req, res) => {
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

    // Check if the selected size exists in the product
    const selectedSize = product.sizes.find(s => s.size === size);
    console.log('Selected Size:', selectedSize);

    if (!selectedSize || selectedSize.stock < qty) {
      console.log('Insufficient stock for size:', size);
      return res.send(`<!DOCTYPE html>
        <html>
        <head>
            <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
        </head>
        <body>
        <script>
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Insufficient stock for the selected size..!. Please decrease the Quantity',
                confirmButtonText: 'OK'
            }).then(() => {
                window.location.href = '/productDetails?id=${productId}';
            });
        </script>
        </body>
        </html>`);
    }

    const totalPrice = product.salePrice * qty;
    console.log('Total Price:', totalPrice);
    console.log('prod-name=',product.productName);
    

    // Check for existing cart
    let cart = await cartSchema.findOne({ userId });
    if (!cart) {
      // Create a new cart if none exists
      cart = new cartSchema({
        userId,
        items: [{
          productId,
          productName:product.productName,
          size,
          quantity: qty,
          price: product.salePrice,
          totalPrice,
        }],
        finalPrice: totalPrice,
      });
    } else {
      // Handle adding or updating cart items
      const item = cart.items.find(item => item.productId.toString() === productId && item.size === size);
      if (!item) {
        cart.items.push({
          productId,
          productName:product.productName,
          size,
          quantity: qty,
          price: product.salePrice,
          totalPrice,
        });
      } else {
        
        if (Number(item.quantity) + Number(qty) > product.maxQuantity) {
          console.log('+++==',item.quantity + qty);
          
          console.log('Reached the maxQuantity per user');
          return res.send(`<!DOCTYPE html>
            <html>
            <head>
                <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
            </head>
            <body>
            <script>
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'You have reached the limit for purchasing this product..!. Please decrease the Quantity',
                    confirmButtonText: 'OK'
                }).then(() => {
                    window.location.href = '/productDetails?id=${productId}';
                });
            </script>
            </body>
            </html>`);
        }else if(Number(item.quantity) + Number(qty) > selectedSize.stock){
          
          console.log('Insufficient stock for size:', size);
          return res.send(`<!DOCTYPE html>
            <html>
            <head>
                <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
            </head>
            <body>
            <script>
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Insufficient stock for the selected size..!. Please decrease the Quantity',
                    confirmButtonText: 'OK'
                }).then(() => {
                    window.location.href = '/productDetails?id=${productId}';
                });
            </script>
            </body>
            </html>`);

        }
        item.quantity += Number(qty);
        item.totalPrice = item.quantity * product.salePrice;
      }

      // Update the final price
      cart.finalPrice = cart.items.reduce((sum, item) => sum + item.totalPrice, 0);
    }

    // Save the cart
    await cart.save();
    console.log('Cart updated:', cart);

    res.redirect(`/productDetails?id=${productId}`);
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.redirect('/notFound');
  }
};


  


const removeCartProduct = async (req,res) => {
  try {

    const userId = req.session.user;
    const itemId = req.query.itemId;


    const cart = await cartSchema.findOne({ userId });
    if (!cart) {
      throw new Error('Cart not found');
    }

    const item = cart.items.find(item => item._id.toString() === itemId);
    if (!item) {
      throw new Error('Item not found in cart');
    }

    const itemTotalPrice = item.totalPrice;

    // await cartSchema.updateOne(
    //   {userId:userId},
    //   {$pull:{items:{_id:itemId}}},
    // )

    await cartSchema.updateOne(
      { userId },
      {
        $pull: { items: { _id: itemId } },
        $inc: { finalPrice: -itemTotalPrice }
      }
    );

    res.status(200).json({ message: 'Product removed successfully!' });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to remove the product.' });

  }
}



const incraseQuantity = async (req,res) => {
  
try {
  console.log('reached..../');
  

  const userId = req.session.user;
  const itemId = req.query.itemId;

console.log('uss==',userId,'ittm==',itemId);


  const cart = await cartSchema.findOne({ userId });
    if (!cart) {
      throw new Error('Cart not found');
    }

    const item = cart.items.find(item => item._id.toString() === itemId);
    if (!item) {
      throw new Error('Item not found in cart');
    }

  const product = await productSchema.findById(item.productId)
  console.log('productt./',product);

  const size = product.sizes.find(size => size.size === item.size)
  console.log('stocc',size);
  


  if(item){
    if(item.quantity + 1 > product.maxQuantity){
      return res.json({success:false, message:'you are reached on the limit of purchasing this product'})

    }else if(item.quantity + 1 >size.stock ){
      return res.json({success:false, message:"Product is Out of Stock...!"})

    }else{


      const updatedCart = await cartSchema.findOneAndUpdate(
        { userId, 'items._id': itemId },
        {
          $inc: { 'items.$.quantity': 1, 'items.$.totalPrice': item.price,finalPrice:item.price },
          $set: { updatedAt: Date.now() }
        },
        { new: true }
      );

      console.log('up../',updatedCart);

    
  console.log('success');
  
  console.log('quan',item.quantity,'ttl=',item.totalPrice,'finl==',cart.finalPrice);
  const newItem = updatedCart.items.find(item => item._id.toString() === itemId);



  return res.json({
    success: true,
    quantity: newItem.quantity,
    totalPrice: newItem.totalPrice,
    finalPrice:updatedCart.finalPrice,
    message: 'Quantity updated successfully'
  });

}
    
}


  
} catch (error) {
  console.error(error);
    res.status(500).json({ error: 'Failed to remove the product.' });

}

}



const decreaseQuantity = async (req,res) => {

  try {
    
    
  const userId = req.session.user;
  const itemId = req.query.itemId;

console.log('uss==',userId,'ittm==',itemId);


  const cart = await cartSchema.findOne({ userId });
    if (!cart) {
      throw new Error('Cart not found');
    }

    const item = cart.items.find(item => item._id.toString() === itemId);

    console.log('oldd==',item)

    if (!item) {
      throw new Error('Item not found in cart');
    }else{

      const updatedCart = await cartSchema.findOneAndUpdate(
        { userId, 'items._id': itemId },
        {
          $inc: { 'items.$.quantity': -1, 'items.$.totalPrice': -item.price,finalPrice:-item.price },
          $set: { updatedAt: Date.now() }
        },
        { new: true }
      );
      console.log('neww==',updatedCart)
      const newItem = updatedCart.items.find(item => item._id.toString() === itemId);

      return res.json({
        success: true,
        quantity: newItem.quantity,
        totalPrice: newItem.totalPrice,
        finalPrice:updatedCart.finalPrice,
        message: 'Quantity updated successfully'
      });

    }
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to remove the product.' });

  }
  
}















module.exports = {
    addToCart,
    loadCart,
    removeCartProduct,
    incraseQuantity,
    decreaseQuantity
}