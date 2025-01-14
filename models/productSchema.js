const mongoose = require('mongoose');
const {Schema} = mongoose;

const produtSchema = new Schema({
    productName :{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    // brand:{
    //     type:String,
    //     required:false
    // },
    category:{
        type:Schema.Types.ObjectId,
        ref:"Category",
        required:true
    },
    regularPrice:{
        type:Number,
        required:true
    },
    discount: {
        type: Number,
        default: 0,
      },
    salePrice:{
        type:Number,
        required:true
    },
    productOffer:{
        type:Number,
        default:0
    },
    sizes: [
        {
          size: { type: String, required: true }, 
          stock: { type: Number, required: true }, 
        },
      ],
    isBlocked:{
        type:Boolean,
        default:false
    },
    productImage:{
        type:[String],
        required:true
    },
    status:{
        type:String,
        enum:["Available","Sold Out"],
        required:true,
        default:"Available"
    },
    purchaseCount:{
        type: Number,
        default: 0 
    },
    maxQuantity: {
         type: Number,
          default: 10 
        },
    createdAt:{
        type:Date,
        default:Date.now
    }
},{timestamp:true},{versionKey:false})

const Product = mongoose.model("Product",produtSchema);
module.exports = Product;
