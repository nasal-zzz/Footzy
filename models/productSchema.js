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
    brand:{
        type:String,
        required:true
    },
    category:{
        type:Schema.Types.ObjectId,
        ref:"Category",
        required:true
    },
    regularPrice:{
        type:Number,
        required:true
    },
    salePrice:{
        type:Number,
        required:true
    },
    productOffer:{
        type:Number,
        default:0
    },
    quantity:{
        type:Number,
        default:true
    },
    productImage:{
        type:[String],
        required:true
    },
    status:{
        type:String,
        enum:["Available","out of stock"],
        required:true,
        default:"Available"
    },
},{timestamp:true},{versionKey:false})

const Product = mongoose.model("Product",produtSchema);
module.exports = Product;
