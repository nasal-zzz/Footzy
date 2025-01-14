const mongoose = require('mongoose')
const {Schema} = mongoose;

const wishlistSchema = new Schema({
    userId: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    items: [
        {
            productId: { 
                type: Schema.Types.ObjectId, 
                refuserI: 'Product', 
                required: true 
            },
            productName:{
                type: String,
                required: true,
            },
            productImage:{
                type: String,
                required: true,
            },
            size:{
                type: String,
                required: true
            },
            quantity: { 
                type: Number, 
                required: true, 
                min: 1 
            },
            price: { 
                type: Number, 
                required: true 
            },
            addedOn:{
                type: Date, 
                default: Date.now 
            }
           
        }
    ],
  
    updatedAt: { 
        type: Date, 
        default: Date.now 
    }
});

const Wishlist = mongoose.model('Wishlist', wishlistSchema);
module.exports = Wishlist;