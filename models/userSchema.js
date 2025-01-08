const mongoose = require('mongoose');
const {Schema} = mongoose;

const userSchema = new Schema({

username :{
    type: String ,
    required : false
},
email:{
    type:String,
    requerd:true,
    unique:true
},
phone:{
    type:String,
    required:false,
    sparse: true,
    default:null
},
googleId: {
    type: String,
    unique: true,
    sparse: true 
},
password:{
    type:String,
    required:false
},
dob:{
    type:Date,
    required:true,
    default:Date.now
},
isBlocked:{
    type:Boolean,
    default:false
},
isAdmin:{
    type:Boolean,
    default:false
},
cart:[{
    type:Schema.Types.ObjectId,
    ref:"Cart"
}],
wallet:{
    type:Number,
    default:0
},
wishlist:[{
    type:Schema.Types.ObjectId,
    ref:"wishlist"
}],
orderHistory:[{
    type:Schema.Types.ObjectId,
    ref:"Order"
}],
createdAt:{
    type:Date,
    default:Date.now,
},
updatedAt:{
    type:Date,
    default:Date.now
},
searchHistory:[{
    category:{
        type:Schema.Types.ObjectId,
        ref:"Category"
    },
    brand:{
        type:String
    },
    searchOn:{
        type:Date,
        default:Date.now
    }
}]
},{versionKey:false})
const User = mongoose.model("User",userSchema)



module.exports = User;