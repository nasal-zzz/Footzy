const mongoose = require('mongoose')
const {Schema} = mongoose;

// const {v4:uuidv4} = require('uuid')


const orderSchema = new Schema({

orderId : {
    type:String,
    required:true,
    unique:true
},
userId: {
    type:Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
orderedItems :[{

productId:{
    type:Schema.Types.ObjectId,
    ref: 'Product',
    required: true
},
productName:{
    type:String,
    required:true
},
productImage:{
    type:String,
    required:true
},
size:{
    type: String,
    required: true
},
price:{
    type:Number,
    required:true
},
quantity:{
    type:Number,
    required:true
},
total:{
    type:Number,
    required:true
},
// status: {
//     type: String,
//     enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled','Return Requested','Returned'],
//     default: 'Pending'
//   } 

}],
totalPrice:{
    type:Number,
    required:true
},
discount:{
type:Number,
default:0,
required:true
},
finalAmount:{
    type:Number,
    required:true
},
address:{
    type:Schema.Types.ObjectId,
    ref: 'Address',
    required: true 
},
paymentMethod: {
    type: String,
    enum: ['Cash on Delivery (COD)', 'Card', 'UPI'],
    required: true
  },
invoiceDate:{
    type:Date,
    default: Date.now

},
orderStatus:{
    type: String,
    required:true,
    enum: ['Pending', 'Processing', 'Shipped', 'Delivered','Cancell-Requested', 'Cancelled','Return-Requested','Returned'],
    default: 'Pending'
}
})


const Orders = mongoose.model("Orders",orderSchema);
module.exports = Orders;




