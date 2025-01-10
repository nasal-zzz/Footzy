const userSchema = require('../../models/userSchema') // requiring user schema

const productSchema = require('../../models/productSchema')

const categorySchema =  require('../../models/categorySchema')

const cartSchema = require('../../models/cartSchema')

const addressSchema =  require('../../models/addressSchema')

const orderSchema =  require('../../models/orderSchema')

const walletSchema =  require('../../models/walletSchema')


const orderDetails = async (req,res) => {
    try {
        const orderId = req.query.orderId;

        const order = await orderSchema.findOne({orderId:orderId})
        // console.log(order,'orderrrr.');
        const orderedItems = order.orderedItems;

        const itemDetails = await Promise.all(
            orderedItems.map(async (item) => {
                const product = await productSchema.findOne({ _id: item.productId });
                return {
                    ...item,
                    image: product ? product.productImage : 'img/default.jpg' 
                };
            })
        );

        const address = await addressSchema.findOne({'address._id':order.address},{ "address.$": 1 })

console.log('ad id==',order.address);


        // console.log('adress==',address);
        
            res.render('orderDetails',{
            title:'Order Details',
            order:order,
            items:orderedItems,
            img:itemDetails,
            address:address
        })
        
    } catch (error) {
        
    }
}





const cancelOrder = async (req, res) => {

    try {
        const { orderId } = req.body;  
        console.log("ord iddd====", orderId);

        const order = await orderSchema.findOne({ orderId: orderId });

        if (!order) {
            return res.status(404).json({ message: 'Order not found.' });
        }

        if (order.orderStatus !== 'Pending') {
            return res.status(400).json({ message: 'Order cannot be canceled at this stage.' });
        }

        await orderSchema.findOneAndUpdate({ orderId: orderId }, { $set: { orderStatus: 'Cancelled' } });

        res.json({ message: 'Order Cancelled successfully.' });
        console.log('Order Cancelled successfully............../');

        for (let item of order.orderedItems) {
            await productSchema.findOneAndUpdate(
                { 
                    _id: item.productId._id, 
                    'sizes.size': item.size 
                },
                { 
                    $inc: { 'sizes.$.stock': item.quantity } 
                },
                { new: true }
            );
        }

        console.log('cancelled.............');

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error. Please try again.' });
    }
}


const returnOrder = async (req,res) => {
    

try {
console.log('......................................................//////////////////////////////////////////////////////////////////////////////////////////////////////');

    const { orderId } = req.body;  
    console.log("ord iddd====", orderId);

    const order = await orderSchema.findOne({ orderId: orderId });

    console.log('orddddrrrrrr==',order);
    

    if (!order) {
        return res.status(404).json({ message: 'Order not found.' });
    }
    console.log('heiiiiiiiiiiiiiiiy');
    

    if (order.orderStatus !== 'Delivered') {
        return res.status(400).json({ message: 'Order cannot be canceled at this stage.' });
    }

    await orderSchema.findOneAndUpdate({ orderId: orderId }, { $set: { orderStatus: 'Return-Requested'} });

    console.log('newww==',);
    

    res.json({ message: 'Order Return Requested' });
    console.log('Order Return Requested successfully............../');

    
} catch (error) {

    console.error(error);
        res.status(500).json({ message: 'Server error. Please try again.' });
    
}

}





const loadWallet = async (req,res) => {
    try {

        const userId = req.session.user;

        const wallet = await walletSchema.findOne({userId:userId})

        res.render('wallet',{
            title:'Wallet',
            wallet:wallet,
            transactions:  wallet.transactions.sort((a, b) => new Date(b.date) - new Date(a.date))
        })
        
    } catch (error) {
        
    }
}














module.exports = {
    orderDetails,
    cancelOrder,
    returnOrder,
    loadWallet
}
