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
    salePrice:{
        type:Number,
        required:true
    },
    productOffer:{
        type:Number,
        default:0
    },
    stock:{
        type:Number,
        required:true
    },
    // sizes:{
    //     type:Object,
    //     require:true
    // },
    // quantity:{
    //     type:Number,
    //     default:true
    // },
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
    createdAt:{
        type:Date,
        default:Date.now
    }
},{timestamp:true},{versionKey:false})

const Product = mongoose.model("Product",produtSchema);
module.exports = Product;
