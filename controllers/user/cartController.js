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
    const product = await productSchema.findById(item.productId).select('productName salePrice productImage description');
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
};

  })
)

console.log('passings==',cartItems);

res.render('cart',{
 item:cartItems,
 title:'Cart',
 subTotal : finalPrice
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
  
      const totalPrice = product.salePrice * qty;
      console.log('Total Price:', totalPrice);
  
      // Check for existing cart
      let cart = await cartSchema.findOne({ userId });
      if (!cart) {
        // Create a new cart if none exists
        cart = new cartSchema({
          userId,
          items: [
            {
              productId,
              size,
              quantity: qty,
              price: product.salePrice,
              totalPrice,
            },
          ],
          finalPrice: totalPrice,
        });
      } else {
        // Check if the product with the same size exists
        const existItemIndex = cart.items.findIndex(
          (item) => item.productId.toString() === productId && item.size === size
        );
  
        if (existItemIndex > -1) {
          // Update existing item's quantity and price
          cart.items[existItemIndex].quantity += qty;
          cart.items[existItemIndex].price = product.salePrice;
          cart.items[existItemIndex].totalPrice =
            cart.items[existItemIndex].quantity * product.salePrice;
        } else {
          // Add new item to the cart
          cart.items.push({
            productId,
            size,
            quantity: qty,
            price: product.salePrice,
            totalPrice,
          });
        }
  
        // Update final price
        cart.finalPrice = cart.items.reduce(
          (sum, item) => sum + item.totalPrice,
          0
        );
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
  










module.exports = {
    addToCart,
    loadCart
}