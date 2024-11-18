const mongoose = require('mongoose');
const {Schema} = mongoose;

const userSchema = new Schema({

username :{
    type: String ,
    required : true
},
email:{
    type:String,
    requerd:true,
    unique:true
},
phone:{
    type:String,
    required:true
},
googleId: {
    type: String,
    unique: true,
    sparse: true  // Ensures unique constraint only on non-null values
},
password:{
    type:String,
    required:true
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