const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    balance: {
        type: Number,
        required: true,
        default: 0
    },
    transactions: [
        {
            amount: {
                type: Number,
                required: true
            },
            type: {
                type: String,
                enum: ['credit', 'debit'],
                required: true
            },
            orderId: {
                type:String,
                ref: 'Order',
                default: null
            },
            description: {
                type: String,
                required: true
            },
            date: {
                type: Date,
                default: Date.now
            }
        }
    ],
    lastUpdated: {
        type: Date,
        default: Date.now
    }
});

// Update wallet balance method
walletSchema.methods.updateBalance = async function (amount, type) {
    if (type === 'credit') {
        this.balance += amount;
    } else if (type === 'debit' && this.balance >= amount) {
        this.balance -= amount;
    } else {
        throw new Error('Insufficient wallet balance');
    }
    this.lastUpdated = new Date();
    await this.save();
};


const Wallet = mongoose.model("Wallet",walletSchema)



module.exports = Wallet;



