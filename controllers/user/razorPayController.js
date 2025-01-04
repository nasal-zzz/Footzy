const Razorpay = require('razorpay');
const crypto = require('crypto');
const env = require("dotenv").config();

const userSchema = require('../../models/userSchema') // requiring user schema

const productSchema = require('../../models/productSchema')

const categorySchema =  require('../../models/categorySchema')

const cartSchema = require('../../models/cartSchema')

const addressSchema =  require('../../models/addressSchema')

const orderSchema =  require('../../models/orderSchema')




const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

const createOrder = async (req, res) => {

    console.log('reached create order ...!');
    
    const { amount } = req.body;

    const options = {
        amount: amount * 100,  // Amount in paise
        currency: 'INR',
        receipt: `receipt_${Date.now()}`
    };

    console.log(options);
    

    try {
        const order = await razorpay.orders.create(options);
        res.json(order);
    } catch (error) {
        res.status(500).send('Error creating order');
    }
};


const generateOrderId = () => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);  
    return `ORD${randomNum}`;
  };



const verifyPayment =  async (req,res) => {

    console.log('reached verifyPayment  ...!');


    const { razorpay_order_id, razorpay_payment_id, razorpay_signature,addressId } = req.body;

    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const generated_signature = hmac.digest('hex');

    const paymentMethod = 'Payment With RazorPAy'



    console.log('id adres body =',addressId);

    const userId = req.session.user;
        

    const orderItems = await cartSchema.findOne({userId:userId})
    console.log('cargt=',orderItems);


    const newOrder = new orderSchema ({
      orderId: generateOrderId(),
      userId,
      orderedItems: [],
      totalPrice:orderItems.finalPrice,
      discount:0,
      finalAmount:0,
      address:addressId,
      paymentMethod,
      paymentId:razorpay_payment_id,
      invoiceDate:Date.now(),
      orderStatus:'Pending'
    })

    console.log();
    

    orderItems.items.forEach(item => {
      newOrder.orderedItems.push({
          productId: item.productId,
          productName: item.productName,
          productImage: item.productImage,
          size:item.size,
          price: item.price,
          quantity: item.quantity,
          total: item.totalPrice
      });
      })
      newOrder.finalAmount = newOrder.totalPrice - newOrder.discount
      await newOrder.save();

      console.log('order saved success full..!');
      
      for (let item of newOrder.orderedItems) {

          const product = await productSchema.findOne({
              _id: item.productId,'sizes.size': item.size,
           }); 

           const sizeIndex = product.sizes.findIndex(size => size.size === item.size);
              product.purchaseCount += item.quantity; 
              product.sizes[sizeIndex].stock -= item.quantity;  
          await product.save();
        }


        console.log('product stocks updated');

        await cartSchema.deleteMany({ userId: userId });

        console.log('cart updated');





    if (generated_signature === razorpay_signature) {
        res.json({ success: true });
    } else {
        res.json({ success: false });
    }
};



module.exports ={
    createOrder,
    verifyPayment
}