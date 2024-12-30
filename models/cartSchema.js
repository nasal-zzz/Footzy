const mongoose = require('mongoose')
const {Schema} = mongoose;



const cartSchema = new Schema({
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
            totalPrice: { 
                type: Number, 
                default: 0 
            }
        }
    ],
    finalPrice: { 
        type: Number, 
        default: 0 
    },
    status: { 
        type: String, 
        enum: ['Active', 'Ordered'], 
        default: 'Active' 
    },
    updatedAt: { 
        type: Date, 
        default: Date.now 
    }
});

const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;